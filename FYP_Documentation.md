# Project Report: Mental Health & Wellness AI Assistant
**Academic Level:** CS Final Year Project (FYP)

## 1. Project Overview
This application is a comprehensive digital solution for mental health management. It combines emotional tracking, clinical reporting, AI-driven sentiment analysis, and emergency crisis management into a single mobile platform.

## 2. Technical Stack
- **Frontend:** React Native (Expo)
- **Backend:** Node.js, Express.js
- **Database:** SQLite (Relational Database)
- **ORM:** Sequelize
- **Authentication:** JWT (JSON Web Tokens) with Bcrypt hashing
- **Key Libraries:** 
  - `react-native-chart-kit` (Analytics)
  - `expo-local-authentication` (Biometrics)
  - `axios` (API requests)

## 3. Core Features
### A. Advanced Analytics Dashboard
- **Mood Trends:** Visualizes mood intensity over time using a Line Chart.
- **Mood Distribution:** Shows the percentage of different emotions logged using a Pie Chart.
- **Clinical Export:** Generates a text-based clinical report of user data that can be shared with doctors.

### B. Smart Private Journal
- **AI Sentiment Analysis:** Automatically analyzes the sentiment of journal entries (Positive, Negative, Neutral).
- **Security:** Locked behind biometric authentication (Fingerprint/FaceID) or passcode.
- **Search & Filter:** Allows users to search through historical entries instantly.

### C. Wellness & Interactive Tools
- **Guided Breathing:** Interactive 4-7-8 breathing animation to reduce immediate anxiety.
- **Sleep Sounds:** A library of relaxing ambient sounds (Rain, Ocean, etc.) with a sleep timer.
- **Medication Tracker:** Daily management system for medications and supplements.

### D. Emergency Management (SOS)
- **Panic Button:** A high-visibility SOS button on the dashboard.
- **SMS Integration:** Automatically prepares an emergency SMS with the user's GPS location link for their emergency contact.

## 4. Database Schema (Relational)
- **Users Table:** Stores credentials, roles, and profiles.
- **MoodLogs Table:** Stores emotional state, intensity, and timestamps.
- **JournalEntries Table:** Stores private logs, categories, and detected sentiment scores.
- **Medications Table:** Stores medication names and schedules.

## 5. Security Implementation
- **Password Hashing:** Uses `bcryptjs` to ensure user passwords are never stored in plain text.
- **Authorization:** Uses JWT tokens to protect clinical data endpoints.
- **Data Privacy:** Journal entries are encrypted and locked behind local authentication.

---

## 6. Manual Setup Guide (VS Code)

### Prerequisites
- Install **Node.js** (v18 or higher)
- Install **VS Code**
- Install **Expo Go** app on your mobile device

### Installation Steps
1. **Clone/Open Project:** Open the `MHW_app` folder in VS Code.
2. **Backend Setup:**
   - Open a terminal.
   - Run: `cd backend`
   - Run: `npm install`
   - Run: `npm run dev`
3. **Frontend Setup:**
   - Open a SECOND terminal.
   - Run: `cd mobile`
   - Run: `npm install`
   - Run: `npm start`
4. **Running the Mobile App:**
   - **On Phone:** Scan the QR code with the **Expo Go** app. (Ensure same Wi-Fi).
   - **On Web:** Press the **`w`** key in the terminal to open in a browser.
   - **On Emulator:** Press the **`a`** key to run on a virtual Android device.
   - **On iOS Emulator:** Press the **`i`** key (Mac only).

---

## 7. Database Access & Management
The project uses **SQLite**, a file-based relational database.

### A. Database File Location
The entire database is stored in a single file:
`c:/Users/PMLS/OneDrive/MHW_app/backend/database.sqlite`

### B. Accessing Data via Script
I have included a database inspector script. To see all users and logs in your terminal, run:
```powershell
node backend/check_db.js
```

### C. Visual Access (Recommended for FYP)
To view the database tables like an Excel spreadsheet:
1. Download **DB Browser for SQLite** (Free).
2. Open the `database.sqlite` file located in the `backend` folder.
3. Click **"Browse Data"** to view Users, MoodLogs, and Journal entries.
4. You can also run custom **SQL Queries** in the "Execute SQL" tab.

