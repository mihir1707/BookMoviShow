import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function AdminDashboard() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_BASE_URL;

    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [movies, setMovies] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');

    const [cities, setCities] = useState([]);
    const [selectedCityId, setSelectedCityId] = useState("");
    const [isSyncing, setIsSyncing] = useState(false);

    // Show form state
    const [showData, setShowData] = useState({
        movieId: '',
        theatreId: '',
        screenNo: '1',
        showDate: '12 Jun',
        showTime: '10:30 AM',
    });

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            toast.error("Unauthorized access.");
            navigate('/');
        }
    }, [user, loading, navigate]);

    // useEffect moved down

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${baseUrl}/admin/stats`, { withCredentials: true });
            setStats(res.data.data);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${baseUrl}/admin/users`, { withCredentials: true });
            setUsers(res.data.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const fetchAllTheaters = async () => {
        try {
            const res = await axios.get(`${baseUrl}/theatres/all`, { withCredentials: true });
            setTheaters(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch theaters", error);
        }
    };

    const fetchAllMovies = async () => {
        try {
            const res = await axios.get(`${baseUrl}/movies`);
            setMovies(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch movies", error);
        }
    };

    const fetchAllCities = async () => {
        try {
            const res = await axios.get(`${baseUrl}/cities`);
            setCities(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch cities", error);
        }
    };

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchStats();
            fetchUsers();
            fetchAllTheaters();
            fetchAllMovies();
            fetchAllCities();
        }
    }, [user]);
    const handleSyncMovies = async () => {
        setIsSyncing(true);
        try {
            const res = await axios.post(`${baseUrl}/admin/sync-movies`, {}, { withCredentials: true });
            toast.success(res.data.message || "Movies synced!");
            fetchAllMovies();
        } catch (error) {
            console.error("Failed to sync movies", error);
            toast.error("Failed to sync movies");
        } finally {
            setIsSyncing(false);
        }
    };

    const handleAddShow = async (e) => {
        e.preventDefault();
        try {
            const defaultSeats = [
                { type: "NORMAL", price: 150, total: 40 },
                { type: "EXECUTIVE", price: 250, total: 30 },
                { type: "VIP", price: 400, total: 20 }
            ];

            await axios.post(`${baseUrl}/shows`, {
                ...showData,
                screenNo: Number(showData.screenNo),
                seats: defaultSeats
            }, { withCredentials: true });
            
            toast.success("Show created successfully!");
        } catch (error) {
            console.error("Failed to create show", error);
            toast.error(error.response?.data?.message || "Failed to create show");
        }
    };

    const filteredTheaters = selectedCityId 
        ? theaters.filter(t => {
            const tCityId = t.cityId?._id || t.cityId;
            return String(tCityId) === String(selectedCityId);
        }) 
        : theaters;

    if (loading || !user) return <div className="mt-40 text-center">Loading...</div>;

    return (
        <div className="pt-24 sm:pt-32 px-4 sm:px-10 lg:px-20 min-h-screen bg-black text-white pb-20">
            <h1 className="text-3xl font-bold mb-6 text-primary">Admin Dashboard</h1>

            {/* Tabs */}
            <div className="flex flex-wrap gap-4 border-b border-gray-800 mb-6 pb-2">
                <button onClick={() => setActiveTab('overview')} className={`pb-2 px-2 font-medium transition ${activeTab === 'overview' ? 'border-b-2 border-primary text-primary' : 'text-gray-400 hover:text-white'}`}>Overview</button>
                <button onClick={() => setActiveTab('theaters')} className={`pb-2 px-2 font-medium transition ${activeTab === 'theaters' ? 'border-b-2 border-primary text-primary' : 'text-gray-400 hover:text-white'}`}>Theaters</button>
                <button onClick={() => setActiveTab('movies')} className={`pb-2 px-2 font-medium transition ${activeTab === 'movies' ? 'border-b-2 border-primary text-primary' : 'text-gray-400 hover:text-white'}`}>Movies</button>
                <button onClick={() => setActiveTab('shows')} className={`pb-2 px-2 font-medium transition ${activeTab === 'shows' ? 'border-b-2 border-primary text-primary' : 'text-gray-400 hover:text-white'}`}>Shows</button>
                <button onClick={() => setActiveTab('users')} className={`pb-2 px-2 font-medium transition ${activeTab === 'users' ? 'border-b-2 border-primary text-primary' : 'text-gray-400 hover:text-white'}`}>Users</button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-black border border-gray-800 p-6 rounded-xl shadow-lg">
                        <p className="text-gray-400 text-sm font-medium mb-1">Total Revenue</p>
                        <h2 className="text-3xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</h2>
                    </div>
                    <div className="bg-black border border-gray-800 p-6 rounded-xl shadow-lg">
                        <p className="text-gray-400 text-sm font-medium mb-1">Active Bookings</p>
                        <h2 className="text-3xl font-bold text-white">{stats.activeBookings}</h2>
                    </div>
                    <div className="bg-black border border-gray-800 p-6 rounded-xl shadow-lg">
                        <p className="text-gray-400 text-sm font-medium mb-1">Total Bookings</p>
                        <h2 className="text-3xl font-bold text-white">{stats.totalBookings}</h2>
                    </div>
                    <div className="bg-black border border-gray-800 p-6 rounded-xl shadow-lg">
                        <p className="text-gray-400 text-sm font-medium mb-1">Total Users</p>
                        <h2 className="text-3xl font-bold text-white">{stats.totalUsers}</h2>
                    </div>
                </div>
            )}

            {/* Theaters Tab */}
            {activeTab === 'theaters' && (
                <div className="flex flex-col gap-6">
                    <div className="bg-black border border-gray-800 p-6 sm:p-10 rounded-xl shadow-lg w-full h-fit">
                        <h2 className="text-xl font-bold mb-4">Filter Theaters by City</h2>
                        <div className="flex flex-col gap-5 max-w-md">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Select City</label>
                                <select 
                                    value={selectedCityId} 
                                    onChange={(e) => setSelectedCityId(e.target.value)} 
                                    className="w-full bg-black border border-gray-800 rounded p-3 text-white focus:border-primary"
                                >
                                    <option value="">All Cities</option>
                                    {cities.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black border border-gray-800 rounded-xl shadow-lg overflow-hidden w-full">
                        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-black text-gray-400 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Theater Name</th>
                                        <th className="px-6 py-4 font-medium">City</th>
                                        <th className="px-6 py-4 font-medium">Address</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {filteredTheaters.map(t => (
                                        <tr key={t._id} className="hover:bg-gray-800/50 transition">
                                            <td className="px-6 py-4 text-white font-medium">{t.name}</td>
                                            <td className="px-6 py-4 text-gray-400">{t.cityId?.name || 'Unknown'}</td>
                                            <td className="px-6 py-4 text-gray-500 truncate max-w-[200px]">{t.address.full}</td>
                                        </tr>
                                    ))}
                                    {filteredTheaters.length === 0 && (
                                        <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-500">No theaters found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Movies Tab */}
            {activeTab === 'movies' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Manage Movies</h2>
                        <button 
                            onClick={handleSyncMovies}
                            disabled={isSyncing}
                            className="bg-primary hover:bg-primary-dull text-black font-bold py-2 px-6 rounded-md transition disabled:opacity-50"
                        >
                            {isSyncing ? "Syncing..." : "Sync Movies"}
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {movies.map(movie => (
                            <div key={movie._id} className="bg-gray-900 rounded overflow-hidden shadow">
                                <img src={movie.posterUrl} alt={movie.title} className="w-full h-48 object-cover" />
                                <div className="p-2">
                                    <p className="text-sm font-bold truncate">{movie.title}</p>
                                    <p className="text-xs text-gray-400">{movie.languages.join(', ')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Shows Tab */}
            {activeTab === 'shows' && (
                <div className="bg-black border border-gray-800 p-6 sm:p-10 rounded-xl shadow-lg max-w-2xl">
                    <h2 className="text-xl font-bold mb-4">Add New Show</h2>
                    <p className="text-gray-400 text-sm mb-6">Link a movie to a theater and schedule a showtime. A new Screen will be automatically created with default seats if it doesn't exist.</p>
                    
                    <form onSubmit={handleAddShow} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Select Movie</label>
                            <select 
                                value={showData.movieId} 
                                onChange={(e) => setShowData({...showData, movieId: e.target.value})}
                                className="w-full bg-black border border-gray-800 rounded p-3 text-white focus:border-primary"
                                required
                            >
                                <option value="">-- Select Movie --</option>
                                {movies.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Select Theater</label>
                            <select 
                                value={showData.theatreId} 
                                onChange={(e) => setShowData({...showData, theatreId: e.target.value})}
                                className="w-full bg-black border border-gray-800 rounded p-3 text-white focus:border-primary"
                                required
                            >
                                <option value="">-- Select Theater --</option>
                                {theaters.map(t => <option key={t._id} value={t._id}>{t.name} ({t.cityId?.name})</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Screen No.</label>
                                <input type="number" min="1" value={showData.screenNo} onChange={(e) => setShowData({...showData, screenNo: e.target.value})} className="w-full bg-black border border-gray-800 rounded p-3 text-white focus:border-primary" required />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Date (e.g. 12 Jun)</label>
                                <input type="text" value={showData.showDate} onChange={(e) => setShowData({...showData, showDate: e.target.value})} className="w-full bg-black border border-gray-800 rounded p-3 text-white focus:border-primary" required />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Time (e.g. 10:30 AM)</label>
                                <input type="text" value={showData.showTime} onChange={(e) => setShowData({...showData, showTime: e.target.value})} className="w-full bg-black border border-gray-800 rounded p-3 text-white focus:border-primary" required />
                            </div>
                        </div>
                        <button type="submit" className="bg-primary hover:bg-primary-dull text-black font-bold py-3 rounded-md transition mt-2">
                            Create Show
                        </button>
                    </form>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="bg-black border border-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-black text-gray-400">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Name</th>
                                    <th className="px-6 py-4 font-medium">Username</th>
                                    <th className="px-6 py-4 font-medium">Email</th>
                                    <th className="px-6 py-4 font-medium">Role</th>
                                    <th className="px-6 py-4 font-medium">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {users.map(u => (
                                    <tr key={u._id} className="hover:bg-gray-800/50 transition">
                                        <td className="px-6 py-4 text-white font-medium">{u.name}</td>
                                        <td className="px-6 py-4 text-gray-300">@{u.username}</td>
                                        <td className="px-6 py-4 text-gray-400">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-gray-800 text-gray-300'}`}>
                                                {u.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
