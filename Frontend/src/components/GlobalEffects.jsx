import Snowfall from "react-snowfall";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

const GlobalEffects = () => {
    const [effect, setEffect] = useState(null);

    useEffect(() => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        if (month === 1 && day <= 3) setEffect("newyear");
        else if (month === 12 || month === 1 || month === 2) setEffect("winter");
        else if (month === 10 || month === 11) setEffect("diwali");
        else if (month >= 7 && month <= 9) setEffect("monsoon");
        else if (month >= 3 && month <= 6) setEffect("summer");
        else setEffect(null);
    }, []);

    const commonStyle = {
        position: "fixed",
        inset: 0,
        zIndex: 5,
        pointerEvents: "none",
    };

    return (
        <>
            {/* WINTER */}
            {effect === "winter" && (
                <Snowfall
                    snowflakeCount={120}
                    style={commonStyle}
                />
            )}

            {/* MONSOON */}
            {effect === "monsoon" && (
                <Confetti
                    numberOfPieces={150}
                    gravity={0.8}
                    colors={["#8ecae6", "#219ebc", "#023047"]}
                    style={commonStyle}
                />
            )}

            {/* SUMMER */}
            {effect === "summer" && (
                <Confetti
                    numberOfPieces={80}
                    gravity={0.05}
                    colors={["#ffd166", "#fca311", "#ffb703"]}
                    style={commonStyle}
                />
            )}

            {/* DIWALI */}
            {effect === "diwali" && (
                <Confetti
                    numberOfPieces={220}
                    gravity={0.15}
                    colors={["#ff9f1c", "#ffd60a", "#ff6f00"]}
                    style={commonStyle}
                />
            )}

            {/* NEW YEAR */}
            {effect === "newyear" && (
                <Confetti
                    numberOfPieces={400}
                    gravity={0.3}
                    colors={["#ffffff", "#ff006e", "#8338ec"]}
                    style={commonStyle}
                />
            )}
        </>
    );
};

export default GlobalEffects;
