# Focus Garden

## Table of Contents<!-- Optional -->
<!-- 
* This section is optional, yet having a contents table 
* helps keeping your README readable and more professional.
* 
* If you are not familiar with HTML, no worries we all been there :D 
* Review learning resources to create anchor links. 
-->

    
<dev align="center">
    <table align="center">
        <tr>
            <td><a href="#about">About</a></td>        
            <td><a href="#how-to-use-this-project">Getting started</td>
            <td><a href="#demo">Demo</a></td>
            <td><a href="#documentation">Documentation</a></td>
        </tr>
        <tr>
            <td><a href="#contributors">Contributors</a></td>
            <td><a href="#feedback">Feedback</a></td>
            <td><a href="#contact">Contact</a></td>
        </tr>
    </table>
</dev>

## About<!-- Required -->
Created By:
**Fernando Caudillo Tafoya** (Backend Developer),
**Fazal Quadri** (Project Lead),
**Helmer Gomez** (Frontend Developer).

This application aims to reduce user's not focusing on what is important. Their garden grows as long as they are on the website and not being distracted on something else. To ensure unique garden names a Bloom Filter is used. For quick and efficient lookup of other users a Trie is used.


Focus Garden was built to address the common issue of digital distraction and excessive screen time. Many people struggle to stay focused on important tasks when using digital devices, often getting sidetracked by unrelated apps or websites. This project provides a visual, rewarding way to encourage better focus habits by allowing users to see their efforts materialize through the growth of a virtual garden. The idea is to positively reinforce focus time instead of punishing distractions, making healthier digital habits more motivating and enjoyable.

## How to use this project<!-- Required -->

This document assumes you have some version of python3, node (npm) installed on your local computer.

### a. Set up Backend
* Move into the backend directory -  ` cd backend `
* Create a new virtual environment - ` python3 -m venv .venv `
* Activate the virtual environment
  * For Windows : ` .\.venv\Scripts\activate `
  * For Mac : ` source .venv/bin/activate `
* You will now see a (.venv) infront of your command line
* To install all dependencies and packages, run ` pip3 install -r requirements.txt `
* Run the flask backend in debug mode for automatic reloading : ` flask --app app.py --debug run `
*  Your flask server will now be running on ` localhost:PORT `! You can look at the terminal for the port number

### b. Set up Frontend
* Move into the frontend directory - ` cd frontend `
* Install all packages by running ` npm install `
* To run the react frontend - ` npm run dev `
* Your react app is now running on ` localhost:PORT `! You can follow the link from the terminal for the port number.
* **Note** If failed to run due to incompatible node_modules or package-lock.json, run ` rm -rf node_modules package-lock.json `, and reinstall the packages

## Demo<!-- Required -->

After backend and frontend setup, navigate to the link provided by the frontend.

### Sign in
* Use your login info to retrieve your garden or create a new account.
![Screenshot 2025-04-28 at 5 16 35 PM](https://github.com/user-attachments/assets/ad6b9ff0-20ca-439b-a7ed-2ecad4c36725)

### Main Page
* Displays user's lifetime screen time, their weekly screen time, and leaderboard featuring top 5 garden's for the day.
![Screenshot 2025-04-28 at 6 33 13 PM](https://github.com/user-attachments/assets/d6ed488d-b124-406e-9cd5-d2bdad3b91b0)



## Documentation<!-- Optional -->
<!-- 
* 
* 
-->
React.js – Chosen for its component-based structure and  fast updates with virtual DOM for building a dynamic, interactive UI.

Vite – Used for faster React app setup and development compared to traditional Create-React-App.

React Router – Used to manage navigation between different pages like Login, Signup, and Main Garden View.

Flask – Selected because it is lightweight, easy to set up, and perfectly suited for smaller full-stack applications like this one.

Firebase – Used for authentication and real-time database storage, simplifying user data management without having to manually build complex database servers.

## Contributors<!-- Required -->
**Fazal Quadri** (Project Lead) - 
    Coordinated team meetings, managed project timelines, and ensured milestones were met.
    Took weekly meeting notes and tracked overall project progress.
    Implemented the Trie structure for efficient leaderboard searching.
    Assisted both frontend and backend as needed (flex role) to balance workload.

**Helmer Gomez** (Backend Developer) - 
    Integrated Firebase to manage user authentication and data storage.
    Implemented the Bloom Filter for username uniqueness and Trie structure for efficient leaderboard searching.
    Ensured proper communication between the backend and frontend systems.

**Fernando Caudillo Tafoya** (Frontend Developer) - 
    Built the frontend interface using React, including the daily and weekly garden grids.
    Designed and implemented the login/signup pages, main dashboard, and leaderboard UI.
    Focused on creating a clean, user-friendly experience with a consistent visual style (dark green/brown color palette).


## Feedback<!-- Required -->
<!-- 
* You can add contacts information like your email and social media account 
* 

* Also it's common to add some PR guidance.
-->
Feel free to open an issue if you find bugs or have suggestions for improvement.

Pull Request Guidelines:

    Fork the repository.

    Create a new branch (git checkout -b feature/yourFeature).

    Commit your changes (git commit -m 'Add your feature').

    Push to the branch (git push origin feature/yourFeature).

    Open a Pull Request.

## Contact<!-- Required -->
<!-- 
* add your email and contact info here
* 
-->
    Fernando Caudillo Tafoya - fcaud2@uic.edu
    Fazal Quadri - mquad5@uic.edu
    Helmer Gomez - hgomez

<p align="right"><a href="#about">back to top ⬆️</a></p>
