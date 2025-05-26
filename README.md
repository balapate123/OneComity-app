---

# 🌿 OneComity - Meet. Match. Mellow.

OneComity is a **mobile-first social discovery app** that helps you meet and connect with nearby people who are:

* Smoking weed 🌿
* Sipping wine 🍷
* Sharing water 💧

Perfect for casual meetups and authentic connections, OneComity also helps you discover nearby weed and alcohol stores, chat in real time, and exchange contacts—only when both parties agree!

---

## 🚀 Features

### ✅ **Backend (Node.js + Express + MongoDB)**

* JWT-based authentication & OTP login (Twilio)
* Age verification workflow
* Geolocation-based user matching
* **Real-time chat using Socket.IO** (DMs & chat list, delete/hide chats)
* Google Maps (Places API) integration for store lookup
* MongoDB geospatial search
* Consent-driven contact sharing for privacy

### ✅ **Frontend (React Native)**

* **Full mobile app UI (React Native CLI, Expo/EAS build ready)**
* Auth & onboarding flows (register, OTP, age verify)
* Activity selection screen
* Live nearby user discovery & map view
* **Swipeable chat list (hide/delete chats)**
* **Real-time 1-to-1 chat interface** (Socket.IO)
* Google Maps with custom user pins & store locator
* Persistent login (JWT stored securely)
* Mobile-friendly, modern card design

---

## 📁 Project Structure

```
onecomity/
├── onecomity-backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── app.js, server.js, .env
│   └── ...
├── onecomity-frontend/
│   ├── App.js, app.config.js, app.json
│   ├── screens/
│   ├── services/
│   ├── components/
│   └── ...
└── README.md
```

---

## 🛠️ .env Configuration

**Backend:**
Create a `.env` in the `/onecomity-backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone
GOOGLE_API_KEY=your_google_maps_api_key
PORT=5000
```

**Frontend:**
Store your API/Socket URLs in an `.env` file at `/onecomity-frontend`:

```env
API_URL=https://your-api-url.com/api
SOCKET_URL=https://your-api-url.com
```

> These are loaded by `app.config.js` using Expo's env integration for builds.

---

## 📍 Tech Stack

* **Backend:** Node.js, Express, MongoDB Atlas, Socket.IO
* **Frontend:** React Native (CLI), Expo, Google Maps SDK
* **Real-time:** Socket.IO
* **Location:** Google Maps/Places API
* **OTP/SMS:** Twilio
* **Deployment:** AWS EC2 (with GitHub Actions CI/CD)

---

## 🌐 Live Demo & Build

* **Backend:** Deployed on AWS EC2 (port 5000, WebSocket enabled)
* **Frontend:** EAS Build ready (APK/AAB supported)
* **[See latest release & download instructions here](https://expo.dev/accounts/atbhargavm/projects/onecomity-frontend/builds)**

---

## 👨‍💻 Developer

Made with ❤️ by [Captain Bhargav](https://github.com/balapate123)

---

## 📦 License

MIT License

---

Let me know if you want to add any GIFs/screenshots or more detail on **chat features**!
You can now **commit and push** this updated README 🚀
