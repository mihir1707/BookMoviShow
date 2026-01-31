import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true, limit: '16kb'}))
app.use(express.static('public'))
app.use(cookieParser())

app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});



import userRouter from './routes/user.router.js'
import cityRouter from './routes/city.router.js'
import movieRouter from './routes/movie.router.js'
import paymentRouter from './routes/payment.router.js'
import adminMovieRouter from './routes/admin.movie.router.js'
import adminRouter from './routes/admin.router.js'
import bookingRouter from './routes/booking,router.js'
import seatRouter from './routes/seat.router.js'
import theatreRoutes from "./routes/theatre.router.js";
import showRoutes from './routes/show.router.js'


app.use('/api/v1/users', userRouter)
app.use('/api/v1/movies', movieRouter)
app.use('/api/v1/cities', cityRouter)
app.use('/api/v1/payment', paymentRouter)
app.use('/api/v1/admin/movies', adminMovieRouter)
app.use('/api/v1/admin/payments/revenue', adminRouter)
app.use('api/v1/booking', bookingRouter)
app.use('api/v1/seats', seatRouter)
app.use("/api/v1/theatres", theatreRoutes);
app.use("/api/v1/shows", showRoutes)


export default app;