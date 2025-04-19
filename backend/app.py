from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from pybloom_live import BloomFilter
import heapq

app = Flask(__name__)
CORS(app)

# --- Firebase Admin SDK Initialization ---
cred = credentials.Certificate('./focus-garden-firebase-adminsdk-fbsvc-bdb29fe927.json')
firebase_admin.initialize_app(cred)
firestore_db = firestore.client()

# -----------------------------
# HashTrie Code
# -----------------------------
class HashNode:
    def __init__(self, char: str):
        self.char = char
        self.children = {}
        self.isWord = False
        self.weight = 0

class HashTrie:
    def __init__(self):
        self.root = HashNode("")

    def insert(self, word: str, weight: int = 0) -> None:
        curr = self.root
        for ch in word.lower():
            if ch not in curr.children:
                curr.children[ch] = HashNode(ch)
            curr = curr.children[ch]
        curr.isWord = True
        curr.weight = weight

    # Basic search to check exact presence
    def search(self, word: str) -> bool:
        curr = self.root
        for ch in word.lower():
            if ch not in curr.children:
                return False
            curr = curr.children[ch]
        return curr.isWord

# Recursive traversal from a node, collecting all full words
def preTraversal(root: HashNode, prefix: str, results=None):
    if results is None:
        results = []

    if root.isWord:
        # Store (full_word, weight)
        results.append((prefix, root.weight))

    for char, child in root.children.items():
        preTraversal(child, prefix + char, results)

    return results

# Start from a node found by following the prefix
def searchTrie(root: HashNode, prefix: str) -> list:
    curr = root
    for ch in prefix.lower():
        if ch not in curr.children:
            return []  # No matches
        curr = curr.children[ch]

    # Traverse from this node to get all possible completions
    return preTraversal(curr, prefix.lower())

# Initialize a global trie
garden_name_trie = HashTrie()

def debug_print_trie(trie):
    """Traverse the entire trie and print each word with its weight."""
    def _dfs(node, prefix):
        if node.isWord:
            print(f"[WORD] {prefix} (weight={node.weight})")
        for char, child in node.children.items():
            _dfs(child, prefix + char)

    print("----- Printing Trie Contents -----")
    _dfs(trie.root, "")
    print("----- End of Trie -----")
    
def build_trie_from_firestore():
    """Load all gardenName fields from Firestore into the hash trie."""
    docs = firestore_db.collection('users').get()
    for doc in docs:
        data = doc.to_dict()
        garden_name = data.get('gardenName', '')
        if garden_name:  # only insert if non-empty
            # Insert with weight=0 (or some score if you like)
            garden_name_trie.insert(garden_name)
    debug_print_trie(garden_name_trie)

build_trie_from_firestore()

# Initiliaze bloom filter
garden_name_bloom = BloomFilter(10000, 0.01)
# storing the current names into the bloom filter
def build_filters_from_firestore():
    docs = firestore_db.collection('users').get()
    for doc in docs:
        data = doc.to_dict()
        garden_name = data.get('gardenName', '')
        if garden_name:
            garden_name_bloom.add(garden_name.strip().lower())

build_filters_from_firestore()
# checks for the garden name 
@app.route('/check_garden_name', methods=['GET'])
def check_garden_name():
    garden_name = request.args.get('name', '').strip().lower()
    if not garden_name:
        return jsonify({'error': 'Missing name'}), 400

    # Check in Bloom filter
    if garden_name in garden_name_bloom:
        return jsonify({'available': False})
    else:
        return jsonify({'available': True})
    
@app.route('/search_garden_name', methods=['GET'])
def search_garden_name():
    # Search for garden names by prefix, returning up to 20 results
    prefix = request.args.get('prefix', '').strip()
    if not prefix:
        return jsonify([])

    # get all completions that start with prefix
    matches = searchTrie(garden_name_trie.root, prefix)
    # matches is a list of (full_garden_name, weight)
    # e.g. [("my garden", 0), ("my awesome garden", 0), ...]

    # Sort them by alphabetical or any other logic
    matches.sort(key=lambda x: x[0])

    # limit to top 20
    top_matches = matches[:5]

    # Return just the garden name strings
    results = [m[0] for m in top_matches]
    return jsonify(results)

@app.route('/signup', methods=['POST'])
def store_signup():
    data = request.get_json()
    if not data or 'username' not in data or 'name' not in data:
        return jsonify({'error': 'Missing username or name in request body'}), 400

    username = data['username']
    name = data['name']

    try:
        user_doc_ref = firestore_db.collection('users').document(username)
        doc = user_doc_ref.get()
        if not doc.exists:
            user_doc_ref.set({
                'totalTimeSeconds': 0,
                'name': name,
                # You can store dailyTime, lifetimeTime, weeklyTimes, etc. here if you wish:
                'dailyTime': 0,
                'lifetimeTime': 0,
                'weeklyTimes': [0, 0, 0, 0, 0, 0, 0],
                'lastUpdated': datetime.utcnow().isoformat(),
                'lastWeek': 0
            })
            print(f"Signup recorded for user {username} with initial time 0 seconds and name {name}")
            # bloom filter adding new name
            garden_name_bloom.add(name.strip().lower())
            return jsonify({'message': f'Signup recorded for user: {username}'}), 201
        else:
            print(f"User {username} already exists.")
            return jsonify({'message': f'User {username} already exists.'}), 200
    except Exception as e:
        print(f"Error recording signup to Firestore: {e}")
        return jsonify({'error': f'Failed to record signup: {str(e)}'}), 500

@app.route('/add_time', methods=['POST'])
def add_time():
    """
    (Optional) If you want to increment totalTimeSeconds by X every call.
    For more fine-grained daily/weekly logic, you can ignore or remove this endpoint.
    """
    data = request.get_json()
    if not data or 'username' not in data or 'secondsToAdd' not in data:
        return jsonify({'error': 'Missing username or secondsToAdd'}), 400

    username = data['username']
    seconds_to_add = data['secondsToAdd']

    try:
        user_doc_ref = firestore_db.collection('users').document(username)
        # Use Firestore's increment if desired:
        firestore_db.run_transaction(
            lambda transaction: transaction.update(
                user_doc_ref,
                {"totalTimeSeconds": firestore.Increment(seconds_to_add)}
            )
        )
        return jsonify({'message': f'Added {seconds_to_add} seconds to user {username}'}), 200
    except Exception as e:
        print(f"Error adding time: {e}")
        return jsonify({'error': f'Failed to add time: {str(e)}'}), 500

@app.route('/get_user_time/<username>', methods=['GET'])
def get_user_time(username):
    """
    Returns a single user's data from Firestore, including dailyTime, lifetimeTime, etc.
    """
    try:
        user_doc = firestore_db.collection('users').document(username).get()
        if user_doc.exists:
            user_data = user_doc.to_dict()
            return jsonify(user_data), 200
        else:
            return jsonify({'error': f'User {username} not found'}), 404
    except Exception as e:
        print(f"Error getting user time from Firestore: {e}")
        return jsonify({'error': f'Failed to get user time: {str(e)}'}), 500

@app.route('/get_all_users', methods=['GET'])
def get_all_users():
    try:
        all_users = []
        users_collection = firestore_db.collection('users').get()
        for doc in users_collection:
            user_data = doc.to_dict()
            # Add the document ID as 'username' if not in the dict
            user_data['username'] = doc.id
            all_users.append(user_data)
        return jsonify(all_users), 200
    except Exception as e:
        print(f"Error retrieving all users: {e}")
        return jsonify({'error': f'Failed to retrieve all users: {str(e)}'}), 500

@app.route('/update_timers', methods=['POST'])
def update_timers():
    """
    Receives the user's dailyTime, lifetimeTime, weeklyTimes, etc. from the React front end.
    Saves it to Firestore every 30 seconds.
    """
    data = request.get_json()
    required_fields = ['username', 'dailyTime', 'lifetimeTime', 'weeklyTimes']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing one of username, dailyTime, lifetimeTime, weeklyTimes'}), 400

    username = data['username']
    daily_time = data['dailyTime']
    lifetime_time = data['lifetimeTime']
    weekly_times = data['weeklyTimes']
    last_week = data.get('lastWeek', 0)  # or handle however you wish
    garden_name = data.get('gardenName', '')

    try:
        user_doc_ref = firestore_db.collection('users').document(username)
        # If doc doesn't exist, create it
        doc = user_doc_ref.get()
        if not doc.exists:
            user_doc_ref.set({
                'dailyTime': daily_time,
                'lifetimeTime': lifetime_time,
                'weeklyTimes': weekly_times,
                'lastUpdated': datetime.utcnow().isoformat(),
                'lastWeek': last_week,
                'gardenName': garden_name
            })
        else:
            user_doc_ref.update({
                'dailyTime': daily_time,
                'lifetimeTime': lifetime_time,
                'weeklyTimes': weekly_times,
                'lastUpdated': datetime.utcnow().isoformat(),
                'lastWeek': last_week,
                'gardenName': garden_name
            })
        return jsonify({'success': True}), 200
    except Exception as e:
        print(f"Error updating timers: {e}")
        return jsonify({'error': f'Failed to update timers: {str(e)}'}), 500

@app.route('/')
def hello():
    return 'Backend server with Firebase for user signup and time management'

