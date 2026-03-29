# 🌍 VoyageIQ – Smart Travel Booking Platform
Travelia is a full-stack web application inspired by Airbnb that allows users to explore, book, and manage travel stays with intelligent features like recommendations and fraud detection.

## ✨ Features

### 🏡 Listings
- Create, edit, and delete listings
- Upload images using Cloudinary
- Categorized browsing (Beach, Mountains, City, etc.)
- Search by location, country, and price range

### ✈️ Booking System
- Book stays with check-in and check-out dates
- Dynamic price calculation based on number of days
- View all bookings in **My Trips**
- Booking validation:
  - Invalid dates prevented
  - Max 30 days booking limit
  - Duplicate booking prevention

### 👤 Authentication
- User signup/login/logout using Passport.js
- Session-based authentication

### ⭐ Reviews
- Add ratings and comments for listings
- View all reviews per listing

### ❤️ Wishlist
- Save favorite listings

### 🤖 Smart Features
- **Recommendation System**
  - Suggests listings based on user preferences
- **Fraud Detection**
  - Flags suspicious listings (e.g. very low price, keywords like “free”)

## 🛠️ Tech Stack
- **Frontend:** EJS, Bootstrap, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** Passport.js
- **File Upload:** Multer + Cloudinary

## 📂 Project Structure
travelia/
│── models/
│ ├── listing.js
│ ├── booking.js
│ ├── review.js
│ └── user.js
│
│── views/
│ ├── listings/
│ ├── bookings/
│ ├── users/
│ └── layouts/
│
│── public/
│ ├── css/
│ └── js/
│
│── app.js
│── schema.js
│── cloudConfig.js


## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/VoyageIQ.git
cd travelia
2. Install dependencies
npm install
3. Start MongoDB
Make sure MongoDB is running locally:
mongod
4. Run the project
node app.js
Open in browser:
http://localhost:3000
