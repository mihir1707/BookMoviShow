const timeFormat = (minutes = 0) => {
    const hours = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${hours}h ${m}m`;
};


export default timeFormat;