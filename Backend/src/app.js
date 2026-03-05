import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

const allowedOrigins = [
  "http://localhost:5173",
  "https://book-movi-show-frontend.vercel.app",
  "https://book-movi-show-frontend-d5hfpcpp-miirs-projects-c2370be5.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true, limit: '16kb'}))
app.use(express.static('public'))
app.use(cookieParser())

app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});

app.get("/", (req, res) => {
  res.send("Server running");
});

app.get("/api", (req, res) => {
  res.send("Server running");
});


import userRouter from './routes/user.router.js'
import cityRouter from './routes/city.router.js'
import movieRouter from './routes/movie.router.js'
import paymentRouter from './routes/payment.router.js'
import bookingRouter from './routes/booking.router.js'
import theatreRoutes from "./routes/theatre.router.js";
import razorpayRouter from "./routes/razorpay.router.js";


app.use('/api/v1/users', userRouter)
app.use('/api/v1/movies', movieRouter)
app.use('/api/v1/cities', cityRouter)
app.use('/api/v1/payments', paymentRouter)
app.use('/api/v1/booking', bookingRouter)
app.use("/api/v1/theatres", theatreRoutes);
app.use("/api/v1/razorpay", razorpayRouter);

export {app};