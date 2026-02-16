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

connectDB()
.then( async ()=>{
    await syncMoviesFromPVR()
    await syncCities()
    startMovieSyncCron()
    expireBookingsJob.start()
    expireLockedSeatsJob.start()
    app.listen(2590, ()=>{
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log('MongoDB connection falied !!',error);
})

app.get("/", (req, res) => {
  res.send("Welcome to book-my-show backend API");
});