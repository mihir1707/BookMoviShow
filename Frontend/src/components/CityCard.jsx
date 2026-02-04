export default function CityCard({ city }) {
    const Icon = city.icon;

    return (
        <div className="flex flex-col items-center cursor-pointer m-3">
            <div
                className={`p-5 rounded-full border-2 ${city.active
                        ? "border-teal-500 text-teal-500"
                        : "border-gray-300 text-gray-600"
                    }
                    hover:border-primary hover:border-2 hover:bg-black
                    `}
            >
                <Icon size={32} className="text-white" />
            </div>
            <p className="text-sm mt-2">{city.name}</p>
        </div>
    );
}
