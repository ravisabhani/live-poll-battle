# 🗳️ Live Poll Battle – Real-time Voting App

A real-time voting web application built using **ReactJS**, **Node.js**, and **Socket.IO**, enabling users to create and join live poll rooms with synchronized voting updates.

---

## 🚀 Features

✅ Create & Join Unique Poll Rooms  
✅ Custom Poll Questions & Two Voting Options  
✅ Real-time Live Vote Updates  
✅ One Vote Per User (Enforced by Socket ID & LocalStorage)  
✅ 60-Second Circular Countdown Timer  
✅ Live Bar Chart Visualization (Chart.js)  
✅ Prevent Re-voting  
✅ Invalid Room Code Handling  
✅ LocalStorage-based Vote Persistence  
✅ Supports Multiple Rooms Simultaneously  

---

## 📁 Tech Stack

**Frontend:** ReactJS, Chart.js, Socket.IO Client  
**Backend:** Node.js, Express, Socket.IO  
**Real-time:** WebSockets  
**UI/UX:** CSS3 

---

## ⚙️ Setup Instructions

1. **Clone the Repository**

    ```bash
    git clone https://github.com/your-username/live-poll-battle.git
    cd live-poll-battle
    ```

2. **Run the Backend Server**

    ```bash
    cd server
    npm install
    node index.js
    ```

    ➡ Server will run at: `http://localhost:5000`

3. **Run the Frontend Client**

    ```bash
    cd client
    npm install
    npm start
    ```

    ➡ App will run at: `http://localhost:3000`

---

## 🔐 Security & Validation

- ❌ Users cannot join non-existent rooms  
- 🔒 One vote per user (enforced using socket ID & localStorage)  
- 🛡️ Votes are securely stored in memory per room  
- 🚫 Re-voting is blocked once the vote is cast  

