# TODO: Add Login Page with Google Authentication

## Completed Tasks
- [x] Create frontend/src/firebase.js with Firebase config placeholders.
- [x] Create frontend/src/pages/Login.js with Google sign-in component.
- [x] Update frontend/src/App.js to add route for /login.
- [x] Install Firebase in frontend.
- [x] Revert backend/src/analysis_engine/image_forensics.py _extract_text method to mock implementation (removed Google Vision API integration).

## Remaining Tasks
- [ ] Replace Firebase config placeholders in frontend/src/firebase.js with actual values from Firebase Console.
- [ ] Test the login page.

## Instructions for Firebase Config (Frontend)
1. Go to the Firebase Console (https://console.firebase.google.com/).
2. Create a new project or select an existing one.
3. In the project settings, find the "General" tab and scroll to "Your apps" section.
4. Add a web app if not already added, and copy the config object.
5. Replace the placeholders in `frontend/src/firebase.js` with the actual values:
   - apiKey: Your Firebase API key
   - authDomain: Your Firebase auth domain
   - projectId: Your Firebase project ID
   - storageBucket: Your Firebase storage bucket
   - messagingSenderId: Your Firebase messaging sender ID
   - appId: Your Firebase app ID

## Testing
- Start the frontend: `npm start` in frontend directory.
- Navigate to `/login` to test Google sign-in.
