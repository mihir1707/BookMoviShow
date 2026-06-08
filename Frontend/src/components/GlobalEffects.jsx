import Snowfall from "react-snowfall";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

const GlobalEffects = () => {
    const [effect, setEffect] = useState(null);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleResize = () => setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        });
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setCursorPos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

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
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 5,
        pointerEvents: "none",
    };

    const getCursorColor = () => {
        switch(effect) {
            case "newyear":
            case "winter": return "rgba(255,255,255,0.8)";
            case "monsoon": return "rgba(30,144,255,0.8)";
            case "summer": return "rgba(255,215,0,0.8)";
            case "diwali": return "rgba(255,140,0,0.9)";
            default: return "rgba(0,0,0,0.7)";
        }
    };

    const cursorStyle = {
        position: "fixed",
        top: cursorPos.y + "px",
        left: cursorPos.x + "px",
        width: "15px",
        height: "15px",
        borderRadius: "50%",
        background: getCursorColor(),
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
        mixBlendMode: "difference",
    };

    return (
        <>
            <div style={cursorStyle} />

            {/* WINTER */}
            {(effect === "winter" || effect === "newyear") && (
                <>
                    <Snowfall snowflakeCount={50} style={commonStyle} />
                    {effect === "newyear" && (
                        <Confetti
                            width={windowSize.width}
                            height={windowSize.height}
                            numberOfPieces={100}
                            colors={["#ffffff", "#ff006e", "#8338ec"]}
                            style={commonStyle}
                        />
                    )}
                </>
            )}

            {/* MONSOON (Rain Effect) */}
            {effect === "monsoon" && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    numberOfPieces={50}
                    wind={0.05}
                    colors={["#8ecae6", "#219ebc", "#023047"]}
                    style={commonStyle}
                />
            )}

            {/* SUMMER */}
            {effect === "summer" && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    numberOfPieces={50}
                    colors={["#ffd166", "#fca311", "#ffb703"]}
                    style={commonStyle}
                />
            )}

            {/* DIWALI */}
            {effect === "diwali" && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    numberOfPieces={50}
                    colors={["#ff9f1c", "#ffd60a", "#ff6f00"]}
                    style={commonStyle}
                />
            )}
        </>
    );
};

export default GlobalEffects;
