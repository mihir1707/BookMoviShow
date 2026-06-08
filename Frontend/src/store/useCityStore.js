import { create } from 'zustand';

const useCityStore = create((set) => ({
    city: localStorage.getItem("userCity") || null,
    cityId: localStorage.getItem("userCityId") || null,
    setCity: (cityName, cityId) => {
        localStorage.setItem("userCity", cityName);
        if (cityId) {
            localStorage.setItem("userCityId", cityId);
        } else {
            localStorage.removeItem("userCityId");
        }
        set({ city: cityName, cityId: cityId || null });
    },
}));

export default useCityStore;
