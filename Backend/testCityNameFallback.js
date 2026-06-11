import axios from 'axios';
import "dotenv/config";

async function run() {
    try {
        const res = await axios.get(`http://localhost:8000/api/v1/shows`, {
            params: { movieId: "6a2949f663b065db8504409e", cityName: "Gandhinagar" }
        });
        console.log("Shows data length with cityName fallback:", res.data.data.length);
        if (res.data.data.length > 0) {
           console.log("Theater name found:", res.data.data[0].name);
        }
    } catch (e) {
        console.error(e.response?.data || e.message);
    }
    process.exit(0);
}
run();
