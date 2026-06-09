 # BookMoviShow

**A Simple & Secure Movie Ticket Booking App**

Welcome to **BookMoviShow**! This is a complete website where you can look up movies, pick your favorite seats, and buy tickets safely online. It's built to feel just like real movie booking platforms, complete with a system that "locks" your seat while you're paying so nobody else can snatch it!

---

## What is BookMoviShow?

BookMoviShow is designed to give you a smooth and fun movie booking experience. With this app, you can:

- **See What's Playing:** Browse movies that are currently in theaters or coming soon.
- **Find Nearby Theaters:** Pick a city and see which theaters are playing your movie.
- **Pick Your Seats:** Click on an interactive map of the theater to choose exactly where you want to sit.
- **Pay Securely:** Buy your tickets using Razorpay (a safe online payment system).
- **Save Your Favorites:** Keep a list of movies you want to watch later.
- **Track Your Bookings:** Look back at your past tickets and booking history.

---

## Features

- **Easy Login:** Sign up or log in securely (Now featuring Google & Phone Login!).
- **Movie Browsing:** Scroll through awesome posters for 'Now Showing' and 'Coming Soon' movies.
- **City Selection:** Automatically find theaters based on your chosen city.
- **Interactive Seating Map:** A visual grid where you can click to select Normal, Executive, or VIP seats.
- **Smart Seat Locking:** If you select a seat, we lock it for a few minutes so nobody else can take it while you enter your payment details.
- **Real Payments:** Integrated with Razorpay so you can securely pay for tickets.
- **Mobile Friendly:** The website looks great on both your phone and your computer.

---

## Images

### Home Page
<p align="center">
  <img src="Screenshots/Home_Page/home-1.png" width="45%" />
  <img src="Screenshots/Home_Page/home-2.png" width="45%" />
</p>
<p align="center">
  <img src="Screenshots/Home_Page/home-3.png" width="45%" />
  <img src="Screenshots/Home_Page/home-4.png" width="45%" />
</p>

---

### Movies Page
<p align="center">
  <img src="Screenshots/Movies_Page/movie-1.png" width="45%" />
  <img src="Screenshots/Movies_Page/movie-2.png" width="45%" />
</p>

---

### Movie Details Page
<p align="center">
  <img src="Screenshots/Movie_Details/movie-details-1.png" width="45%" />
  <img src="Screenshots/Movie_Details/movie-details-2.png" width="45%" />
</p>
<p align="center">
  <img src="Screenshots/Movie_Details/movie-details-3.png" width="45%" />
</p>

---

### Theater List
<p align="center">
  <img src="Screenshots/Theater_List/theater-list-1.png" width="45%" />
  <img src="Screenshots/Theater_List/theater-list-2.png" width="45%" />
</p>

---

### Seat Selection Page
<p align="center">
  <img src="Screenshots/Seat_Layout/seat-layout-1.png" width="45%" />
  <img src="Screenshots/Seat_Layout/seat-layout-2.png" width="45%" />
</p>
<p align="center">
  <img src="Screenshots/Seat_Layout/seat-layout-3.png" width="45%" />
  <img src="Screenshots/Seat_Layout/seat-layout-4.png" width="45%" />
</p>

---

### Payment Page
<p align="center">
  <img src="Screenshots/Payment_Page/payment-1.png" width="45%" />
</p>

---

### Favorite Page
<p align="center">
  <img src="Screenshots/Favorite/favorite-1.png" width="45%" />
</p>

---

## 🛠️ How It's Built

This project is built using the popular **MERN Stack**:
- **Frontend (What you see):** Built with React.js and styled with Tailwind CSS to make it look beautiful.
- **Backend (The brain):** Built with Node.js and Express.js to handle all the logic and API requests.
- **Database (Where data lives):** MongoDB Atlas stores all the user, movie, and booking information.
- **Special Integrations:** Uses Razorpay for money stuff, Firebase for Google/Phone logins, and Geoapify for location data.

---

## How to Run This on Your Computer

Want to run this project yourself? Just follow these simple steps!

### 1. Download the Code
```bash
git clone https://github.com/mihir1707/BookMoviShow.git
```

### 2. Install the Required Packages

Open your terminal and install the tools for the Frontend:
```bash
cd Frontend
npm install
```

Then do the same for the Backend:
```bash
cd ../Backend
npm install
```

### 3. Add Your Secret Keys (.env files)

You'll need to create a file named `.env` in both your Frontend and Backend folders to hold your secret keys. 

**Create `.env` inside the `Backend` folder:**
```env
PORT=8000
MONGODB_URL=your_mongodb_connection_string
CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

PVR_CITIES_API=https://api3.pvrcinemas.com/api/v1/booking/content/city
PVR_NOWSHOWING_API=https://api3.pvrcinemas.com/api/v1/booking/content/nowshowing
PVR_COMINGSOON_API=https://api3.pvrcinemas.com/api/v1/booking/content/comingsoon

GEOAPIFY_KEY=your_geoapify_api_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
```

**Create `.env` inside the `Frontend` folder:**
```env
VITE_BASE_URL=http://localhost:8000/api/v1
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### 4. Start the App!

Start the Backend server:
```bash
cd Backend
npm run dev
```

Open a new terminal window and start the Frontend:
```bash
cd Frontend
npm run dev
```

---

## How the "Seat Lock" Works

Have you ever tried to buy tickets and someone else stole your seat at the last second? We fixed that!
- When you click on a seat, we put a temporary "lock" on it.
- While the seat is locked, no other user on the website can select it.
- If you pay successfully, the seat becomes permanently yours!
- If you take too long or your payment fails, the lock expires, and the seat is returned for others to buy.

---

## Created By

**Mihir Khunt**  
Check out my GitHub: [github.com/mihir1707](https://github.com/mihir1707)  

---

## License

This project was built for fun, education, and learning purposes! Feel free to explore the code.
