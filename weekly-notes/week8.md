## Overview:
**When**:  3/13
**Duration**:  6:00 - 7:00 PM
**Where**:  Discord

## Attendance
**Late**: N/A
**Missing**: N/A

## Recent Progress:
- Helmer added template of frontend and we tested on our ends which works as intended.
- Using Google cloud API to keep track of user data. 

## Meeting Notes: 
GitHub Revisions and Contributions
1. We have been putting effort. Helmer got the front-end template meeting. I have been taking weekly meeting notes, making sure meetings are set up, keeping everyone in check. Fernando was researching backend and making sure what data structures to use. He has came up with valuable notes for our backend integration and will be implementing them soon.
2. We met at 3/3, 3/13 and took detailed notes.
3. Each member was present during the project check-in meeting.
4.  As of right now everything is balanced. To improve balancing load, I will also be a flex and help frontend or backend when needed.
5. Helmer has pushed his template of frontend. I forgot to push the 3/3 day nots which is my fault. didnt realize until i took notes today. rookie mistake.


Full Stack Application
1. Focus Garden helps users reduce screen time by providing a game visual incentive where plants grow when you are off-screen. This encourages healthier digital habits.
2. written in 3/3 notes
3.  ethical issue privacy concerns. only collect data given by user which will be screen time info. users have control to reset/delete data.
4. Connect front-end to back end by week9.  Implement plant growth logic/parsing screen data. week 10. add leaderboards, reward system, and basic user testing by week 11.

Data Source & Backend Integration
1. Firebase 
2. Our backend will integrate with the Firease API to pull in user data at login. When a user logs in, the backend will query the API for their screen time data. If a record for that user already exists in our database, the data will be updated; if not, a new record will be created. 
3.raw screen time data is parsed and convert mins to hours etc. 

Choice & Data Structures(rough draft 99% sure)
1. -tree structure, each plant will be used as a node in a growth tree
2. - priority queue for handling timed events like watering reminders or daily checks for screen time updates.
3. considered state flags or array but would be hard to deal with when adding growth logic
considered list with sorting method but priority q handles it efficiently

## Action Items (Work In Progress):
- Helmer is working on front-end of user login
- Fernando is getting google cloud api setup, getting key etc
- Fazal is flex
