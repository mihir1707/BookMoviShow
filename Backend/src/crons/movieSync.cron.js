import cron from "node-cron";
import mongoose from "mongoose";
import syncMoviesFromPVR from "../services/syncMovies.service.js";

const startMovieSyncCron = () => {

    cron.schedule("0 */6 * * *", async() => {
        if (mongoose.connection.readyState !== 1) {
            console.warn("Movie sync skipped: DB not connected");
            return;
        }
        try{
            console.log("Auto movie sync started...")
            const count = await syncMoviesFromPVR()
            console.log(`Auto movie sync completed. Movies synced: ${count}`);
        }
        catch(error){
            console.error("Auto movie sync failed:", error.message);
        }
    })
}

export default startMovieSyncCron;