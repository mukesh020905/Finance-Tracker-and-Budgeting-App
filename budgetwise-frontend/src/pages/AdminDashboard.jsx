import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
    const { currentUser } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalTransactions: 0,
        systemHealth: "Good"
    });
    const [loading, setLoading] = useState(true);

    // Mock data for admin charts
    const userGrowthData = [
        { name: 'Jan', users: 40 },
        { name: 'Feb', users: 55 },
        { name: 'Mar', users: 80 },
        { name: 'Apr', users: 110 },
        { name: 'May', users: 145 },
        { name: 'Jun', users: 190 },
    ];

    useEffect(() => {
        // In a real app, you would fetch these stats from an admin-only API
        // For now, we'll simulate a fetch
        const fetchAdminStats = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setStats({
                totalUsers: 1250,
                activeUsers: 843,
                totalTransactions: 15420,
                systemHealth: "Operational"
            });
            setLoading(false);
        };

        fetchAdminStats();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen text-blue-600">
            <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading Admin Panel...
        </div>
    );

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
                    <p className="text-gray-600">System Overview & Management</p>
                </div>
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-semibold">
                    Admin Access Granted
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card bg-blue-50 border-blue-200">
                    <h4 className="text-blue-600 font-semibold mb-2">Total Users</h4>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                </div>
                <div className="card bg-green-50 border-green-200">
                    <h4 className="text-green-600 font-semibold mb-2">Active Users</h4>
                    <p className="text-3xl font-bold text-gray-800">{stats.activeUsers}</p>
                </div>
                <div className="card bg-purple-50 border-purple-200">
                    <h4 className="text-purple-600 font-semibold mb-2">Transactions</h4>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalTransactions.toLocaleString()}</p>
                </div>
                <div className="card bg-orange-50 border-orange-200">
                    <h4 className="text-orange-600 font-semibold mb-2">System Status</h4>
                    <p className="text-3xl font-bold text-gray-800">{stats.systemHealth}</p>
                </div>
            </div>

            {/* User Growth Chart */}
            <div className="card">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">User User Growth</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={userGrowthData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip
                                cursor={{ fill: '#f1f5f9' }}
                                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
