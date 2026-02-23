import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SecretAdminRegister = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            // Hardcoded to create ADMIN
            await register(username, email, password, ["admin"]);
            navigate("/login");
        } catch (err) {
            console.error("Admin Registration Error:", err);
            const errorMsg = err.response?.data?.message || err.message || "Failed to register admin.";
            setError(`Debug: ${errorMsg} | Status: ${err.response?.status}`);
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-gray-900">
            <div className="card w-full max-w-md relative overflow-hidden border-t-4 border-t-red-600 bg-gray-800 text-white">
                <h2 className="text-3xl font-bold text-center mb-2 text-red-500">Admin Setup</h2>
                <p className="text-center text-gray-400 mb-8 text-sm">Confidential Registration Portal</p>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2 ml-1">Admin Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 placeholder-gray-500"
                            placeholder="Choose admin username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2 ml-1">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 placeholder-gray-500"
                            placeholder="admin@budgetwise.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 placeholder-gray-500"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 mt-4"
                        disabled={loading}
                    >
                        {loading ? "Creating System Admin..." : "Initialize Admin Access"}
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-500">
                    Restricted Access Area
                </div>
            </div>
        </div>
    );
};

export default SecretAdminRegister;
