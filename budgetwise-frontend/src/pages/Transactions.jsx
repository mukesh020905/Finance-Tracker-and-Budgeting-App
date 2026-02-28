import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Transactions = () => {
    const { currentUser } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        type: 'EXPENSE',
        amount: '',
        category: 'FOOD',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });

    const fetchTransactions = async () => {
        if (!currentUser) return;
        try {
            const token = currentUser.token;
            const res = await axios.get(((import.meta.env.VITE_API_URL || "http://localhost:8080") + "/api/transactions"), {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(res.data);
        } catch (error) {
            console.error("Error fetching transactions", error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [currentUser]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({
            type: 'EXPENSE',
            amount: '',
            category: 'FOOD',
            date: new Date().toISOString().split('T')[0],
            description: ''
        });
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = currentUser.token;
            if (editingId) {
                await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/transactions/${editingId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(((import.meta.env.VITE_API_URL || "http://localhost:8080") + "/api/transactions"), formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            resetForm();
            fetchTransactions();
        } catch (error) {
            console.error(`Error ${editingId ? 'updating' : 'adding'} transaction`, error);
        }
    };

    const handleEditSetup = (t) => {
        setFormData({
            type: t.type,
            amount: t.amount,
            category: t.category,
            date: t.date,
            description: t.description || ''
        });
        setEditingId(t.id);
    };

    const handleCancelEdit = () => {
        resetForm();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const token = currentUser.token;
            await axios.delete(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/transactions/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTransactions();
        } catch (error) {
            console.error("Error deleting transaction", error);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-fintech-primary">Transactions</h2>

            {/* Add/Edit Transaction Form */}
            <div className="card">
                <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Transaction' : 'Add New Transaction'}</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <select name="type" value={formData.type} onChange={handleInputChange} className="input-field">
                        <option value="INCOME">Income</option>
                        <option value="EXPENSE">Expense</option>
                    </select>
                    <input
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                    />
                    <select name="category" value={formData.category} onChange={handleInputChange} className="input-field">
                        <option value="FOOD">Food</option>
                        <option value="RENT">Rent</option>
                        <option value="TRAVEL">Travel</option>
                        <option value="BILLS">Bills</option>
                        <option value="INVESTMENT">Investment</option>
                        <option value="ENTERTAINMENT">Entertainment</option>
                        <option value="SALARY">Salary</option>
                        <option value="OTHER">Other</option>
                    </select>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                    <div className="lg:col-span-5 flex justify-end gap-2">
                        {editingId && (
                            <button type="button" onClick={handleCancelEdit} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fintech-primary transition duration-150">Cancel</button>
                        )}
                        <button type="submit" className="btn-primary">{editingId ? 'Update Transaction' : 'Add Transaction'}</button>
                    </div>
                </form>
            </div>

            {/* Transactions List */}
            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="pb-2">Date</th>
                                <th className="pb-2">Category</th>
                                <th className="pb-2">Description</th>
                                <th className="pb-2">Amount</th>
                                <th className="pb-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((t) => (
                                <tr key={t.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                    <td className="py-2">{t.date}</td>
                                    <td className="py-2"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{t.category}</span></td>
                                    <td className="py-2">{t.description}</td>
                                    <td className={`py-2 font-bold ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.type === 'INCOME' ? '+' : '-'}₹{t.amount}
                                    </td>
                                    <td className="py-2 flex gap-4">
                                        <button onClick={() => handleEditSetup(t)} className="text-fintech-primary hover:text-blue-700 text-sm font-medium">Edit</button>
                                        <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-gray-500">No transactions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Transactions;
