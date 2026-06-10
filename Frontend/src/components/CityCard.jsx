export default function CityCard({ city, onSelect }) {
    const Icon = city.icon;

    return (
        <div onClick={onSelect} className="flex flex-col items-center cursor-pointer m-1 sm:m-2">
            <div
                className={`p-3 sm:p-4 rounded-full border-2 ${city.active
                        ? "border-teal-500 text-teal-500"
                        : "border-gray-300 text-gray-600"
                    }
                    hover:border-primary hover:border-2 hover:bg-black
                    `}
            >
                <Icon size={28} className="text-white" />
            </div>
            <p className="text-xs sm:text-sm mt-2 text-center text-gray-300">{city.name}</p>
        </div>
    );
}
