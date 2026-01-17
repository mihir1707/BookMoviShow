export default function CityCard({ city }) {
    const Icon = city.icon;

    return (
        <div className="flex flex-col items-center cursor-pointer">
            <div
                className={`p-4 rounded-full border ${city.active
                        ? "border-teal-500 text-teal-500"
                        : "border-gray-300 text-gray-600"
                    }`}
            >
                <Icon size={32} />
            </div>
            <p className="text-sm">{city.name}</p>
        </div>
    );
}
