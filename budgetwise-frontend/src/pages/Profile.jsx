import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        monthlyIncome: '',
        currentSavings: '',
        targetExpense: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ type: '', content: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!currentUser) return;
            try {
                const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
                const res = await axios.get(((import.meta.env.VITE_API_URL || "http://localhost:8080") + "/api/profile"), config);
                if (res.data) {
                    setFormData({
                        monthlyIncome: res.data.monthlyIncome || '',
                        currentSavings: res.data.currentSavings || '',
                        targetExpense: res.data.targetExpense || ''
                    });
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching profile", err);
                setLoading(false);
            }
        };
        fetchProfile();
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg({ type: '', content: '' });
        setSaving(true);
        try {
            const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
            await axios.post(((import.meta.env.VITE_API_URL || "http://localhost:8080") + "/api/profile"), formData, config);
            setMsg({ type: 'success', content: 'Profile updated successfully!' });
            setTimeout(() => setMsg({ type: '', content: '' }), 3000); // Clear message
        } catch (err) {
            console.error("Error updating profile", err);
            setMsg({ type: 'error', content: 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    const getRoleBadge = (roles) => {
        if (!roles) return null;
        return roles.map((role, index) => (
            <span key={index} className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-600 border border-blue-200 uppercase tracking-wide">
                {role.replace('ROLE_', '')}
            </span>
        ));
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen text-blue-600">
            <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading Profile...
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <header className="mb-4">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    My Profile
                </h2>
                <p className="text-gray-500 mt-1">Manage your account and financial goals</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* User Info Card */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center h-full">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-4 text-4xl shadow-inner">
                            👤
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{currentUser.username}</h3>
                        <p className="text-gray-500 text-sm mb-4">{currentUser.email}</p>

                        <div className="flex flex-wrap gap-2 justify-center mb-6">
                            {getRoleBadge(currentUser.roles)}
                        </div>

                        <div className="w-full border-t border-gray-100 pt-4 mt-auto">
                            <p className="text-xs text-gray-400">Member since 2026</p>
                        </div>
                    </div>
                </div>

                {/* Financial Form Card */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="text-xl">💰</span> Financial Settings
                        </h3>

                        {msg.content && (
                            <div className={`p-4 rounded-lg mb-6 flex items-start gap-3 ${msg.type === 'success' ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                                }`}>
                                <span className="text-xl">{msg.type === 'success' ? '✅' : '⚠️'}</span>
                                <p>{msg.content}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-lg">₹</span>
                                        </div>
                                        <input
                                            type="number"
                                            className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="5000"
                                            value={formData.monthlyIncome}
                                            onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Savings</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-lg">₹</span>
                                        </div>
                                        <input
                                            type="number"
                                            className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="10000"
                                            value={formData.currentSavings}
                                            onChange={(e) => setFormData({ ...formData, currentSavings: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Target Monthly Expense</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-lg">₹</span>
                                    </div>
                                    <input
                                        type="number"
                                        className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="3000"
                                        value={formData.targetExpense}
                                        onChange={(e) => setFormData({ ...formData, targetExpense: e.target.value })}
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2 ml-1">
                                    setting a realistic target helps our AI advisor give better insights.
                                </p>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex gap-4 justify-end">
                                <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors font-medium">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all flex items-center gap-2 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
