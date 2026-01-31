import cron from "node-cron";
import syncMoviesFromPVR from "../services/syncMovies.service.js";

const startMovieSyncCron = () => {

    cron.schedule("0 */6 * * *", async() => {
        try{
            console.log("Auto movie sync started...")
            const count = syncMoviesFromPVR()
            console.log(`Auto movie sync completed. Movies synced: ${count}`);
        }
        catch(error){
            console.error("Auto movie sync failed:", error.message);
        }
    })
}

export default startMovieSyncCron;