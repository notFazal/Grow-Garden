from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

app = Flask(__name__)
CORS(app)

# --- Firebase Admin SDK Initialization ---
cred = credentials.Certificate('./focus-garden-firebase-adminsdk-fbsvc-4a6845fd4f.json')
firebase_admin.initialize_app(cred)
firestore_db = firestore.client()

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

if __name__ == '__main__':
    app.run(debug=True)
