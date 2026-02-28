import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Budgets = () => {
    const { currentUser } = useContext(AuthContext);
    const [budgets, setBudgets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [formData, setFormData] = useState({
        category: 'FOOD',
        limit: ''
    });

    const fetchData = async () => {
        if (!currentUser) return;
        try {
            const token = currentUser.token;
            const headers = { Authorization: `Bearer ${token}` };

            const [budgetsRes, transRes] = await Promise.all([
                axios.get(((import.meta.env.VITE_API_URL || "http://localhost:8080") + "/api/budgets"), { headers }),
                axios.get(((import.meta.env.VITE_API_URL || "http://localhost:8080") + "/api/transactions"), { headers })
            ]);

            setBudgets(budgetsRes.data);
            setTransactions(transRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentUser]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = currentUser.token;
            await axios.post(((import.meta.env.VITE_API_URL || "http://localhost:8080") + "/api/budgets"), formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData({ category: 'FOOD', limit: '' });
            fetchData();
        } catch (error) {
            console.error("Error setting budget", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this budget?")) return;
        try {
            const token = currentUser.token;
            await axios.delete(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/budgets/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (error) {
            console.error("Error deleting budget", error);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-fintech-primary">Budgets</h2>

            {/* Set Budget Form */}
            <div className="card max-w-lg">
                <h3 className="text-lg font-semibold mb-4">Set Monthly Limit</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select name="category" value={formData.category} onChange={handleInputChange} className="input-field mt-1">
                            <option value="FOOD">Food</option>
                            <option value="RENT">Rent</option>
                            <option value="TRAVEL">Travel</option>
                            <option value="BILLS">Bills</option>
                            <option value="INVESTMENT">Investment</option>
                            <option value="ENTERTAINMENT">Entertainment</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Monthly Limit (₹)</label>
                        <input
                            type="number"
                            name="limit"
                            value={formData.limit}
                            onChange={handleInputChange}
                            className="input-field mt-1"
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full">Set Budget</button>
                </form>
            </div>

            {/* Budgets List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgets.map((b) => {
                    const currentMonthPrefix = new Date().toISOString().substring(0, 7);
                    const spent = transactions
                        .filter(t => t.type === 'EXPENSE' && t.category === b.category && t.date.startsWith(currentMonthPrefix))
                        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

                    const progress = Math.min((spent / b.monthlyLimit) * 100, 100);
                    const remaining = Math.max(b.monthlyLimit - spent, 0);
                    const isOverBudget = spent > b.monthlyLimit;

                    return (
                        <div key={b.id} className={`card border-l-4 ${isOverBudget ? 'border-red-500' : 'border-fintech-accent'}`}>
                            <div className="flex justify-between items-start">
                                <div className="w-full">
                                    <h4 className="text-lg font-bold text-gray-800">{b.category}</h4>
                                    <div className="flex justify-between items-end mt-2">
                                        <div>
                                            <p className="text-sm text-gray-500">Spent / Limit</p>
                                            <p className={`text-xl font-semibold ${isOverBudget ? 'text-red-500' : 'text-gray-800'}`}>
                                                ₹{spent.toFixed(2)} <span className="text-sm font-normal text-gray-500">/ ₹{b.monthlyLimit}</span>
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Remaining</p>
                                            <p className={`text-lg font-semibold ${isOverBudget ? 'text-red-500' : 'text-fintech-success'}`}>
                                                ₹{remaining.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className={`${isOverBudget ? 'bg-red-500' : progress > 80 ? 'bg-orange-400' : 'bg-fintech-accent'} h-2.5 rounded-full transition-all duration-300`}
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(b.id)} className="text-gray-400 hover:text-red-600 transition duration-150 ml-4">
                                    &times;
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Budgets;
