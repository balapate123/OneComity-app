# 🌿 OneComity - Meet. Match. Mellow.

OneComity is a mobile social discovery app that helps users find and connect with nearby people who are:
- Smoking weed 🌿
- Sipping wine 🍷
- Sharing water 💧

Designed for casual meetups and mindful connections, OneComity also shows nearby weed and alcohol stores, supports real-time chat, and includes consent-based contact sharing.

---

## 🚀 Features

### ✅ Backend (Node.js + Express + MongoDB)
- JWT-based authentication
- OTP verification via Twilio
- Age verification system
- Geolocation-based user matching
- Real-time Socket.IO chat
- Google Maps (Places API v2) integration for store lookup
- MongoDB geospatial queries
- Consent control for chat/contact sharing

### ✅ Frontend (React Native CLI - coming soon)
- Mobile-first design
- Google Maps with user/location pins
- Real-time chat interface
- Authentication + onboarding flow
- Activity discovery & live location sharing

---

## 📁 Project Structure

```

onecomity/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── ...
├── frontend/ (React Native CLI)
│   └── (coming soon)
└── README.md

````

---

## 🛠️ .env Configuration

Make sure to create a `.env` file in the `backend/` directory with:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone
GOOGLE_API_KEY=your_google_maps_api_key
````

> ⚠️ Never commit this file — it's listed in `.gitignore` for security.

---

## 📍 Tech Stack

* **Backend:** Node.js, Express, MongoDB Atlas
* **Frontend:** React Native CLI (Bare)
* **Chat:** Socket.IO
* **Location Services:** Google Maps SDK, Places API v2
* **SMS & OTP:** Twilio
* **Hosting (planned):** AWS EC2 / Elastic Beanstalk

---

## 👨‍💻 Developer

Made with ❤️ by [Captain Bhargav](https://github.com/balapate123)

---

## 📦 License

MIT License

````

---

### ✅ Add and Commit It

```bash
git add README.md
git commit -m "Add project README"
git push
