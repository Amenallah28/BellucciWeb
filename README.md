
---

## Setup Instructions

### 1. Backend (Flask + MongoDB)

**Requirements:** Python 3.8+, pip, MongoDB running locally

```bash
cd bellucci_backend
pip install flask flask-cors pymongo firebase-admin
# Make sure MongoDB is running on localhost:27017
python app.py
```

- The backend will run on `http://localhost:5000`
- Place your `firebase-creds.json` in this directory (get it from Firebase Console > Project Settings > Service Accounts).

### 2. Frontend (React)

**Requirements:** Node.js 16+, npm

```bash
cd bellucci
npm install
npm start
```

- The frontend will run on `http://localhost:3000`
- Configure your Firebase web credentials in a `.env` file or directly in `firebase.js`.

### 3. Environment Variables

Create a `.env` file in `bellucci/` with your Firebase web config:





Bellucci is a Tinder-like fashion discovery web app where users can swipe through clothing items, like/dislike/save them, and purchase directly. The platform supports both buyers and sellers, with personalized recommendations and event-based filtering.

## Usage

- **Buyers:** Sign up, swipe to discover, save to closet, add to cart, and place orders.
- **Sellers:** Register as a seller, add/manage products, and view/manage orders.
- **Admin:** (Optional) Manage users and products directly in MongoDB.



---

## License

This project is for educational purposes (PFE).  
All images and brand names are used for demo purposes only.

---

## Author

Amen Allah  Mrabet









## Website Overview

Bellucci is a next-generation fashion discovery platform inspired by the swipe-based experience of Tinder. Users can:

- **Swipe left/right/up** on clothing items to like, dislike, or add to cart.
- **Save favorite items** to their personal closet for later.
- **Receive personalized recommendations** based on their style and interactions.
- **Filter by event or trend** (e.g., Wedding, Party, Work).
- **Sellers** can register, add products, and manage orders through a dedicated dashboard.

The goal is to make discovering and shopping for fashion fun, interactive, and tailored to each user’s preferences.