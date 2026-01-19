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

app.use('/api/v1/users', userRouter)
app.use('/api/v1/movies', movieRouter)
app.use('/api/v1/cities', cityRouter)
app.use('/api/v1/payment', paymentRouter)


export default app;