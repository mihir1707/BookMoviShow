import dotenv from 'dotenv'
import connectDB from './db/db.js'
import {app} from './app.js'
import startMovieSyncCron from './crons/movieSync.cron.js'
import syncMoviesFromPVR from './services/syncMovies.service.js'
import syncCities from './services/syncCities.service.js'
import expireLockedSeatsJob from './crons/expireLockedSeats.cron.js'
import expireBookingsJob from './crons/expireBookings.cron.js'

dotenv.config({
    path: './.env'
})

// dotenv.config()


// Initialize database and cron jobs
connectDB()
.then( async ()=>{
    await syncMoviesFromPVR()
    await syncCities()
    startMovieSyncCron()
    expireBookingsJob.start()
    expireLockedSeatsJob.start()
    console.log('Database connected and crons started');
})
.catch((error) => {
    console.log('MongoDB connection falied !!',error);
})

// Only listen in local development, not on Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 2590;
    app.listen(PORT, ()=>{
        console.log(`Server is running at port : ${PORT}`);
    })
}

// Export app for Vercel serverless functions
export default app;