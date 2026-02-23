import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Goals = () => {
    const { currentUser } = useContext(AuthContext);
    const [goals, setGoals] = useState([]);
    const [formData, setFormData] = useState({
        goalName: '',
        targetAmount: '',
        currentSaved: '',
        deadline: ''
    });

    const fetchGoals = async () => {
        if (!currentUser) return;
        try {
            const token = currentUser.token;
            const res = await axios.get('http://localhost:8080/api/goals', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGoals(res.data);
        } catch (error) {
            console.error("Error fetching goals", error);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, [currentUser]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = currentUser.token;
            await axios.post('http://localhost:8080/api/goals', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData({
                goalName: '',
                targetAmount: '',
                currentSaved: '',
                deadline: ''
            });
            fetchGoals();
        } catch (error) {
            console.error("Error adding goal", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete goal?")) return;
        try {
            const token = currentUser.token;
            await axios.delete(`http://localhost:8080/api/goals/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchGoals();
        } catch (error) {
            console.error("Error deleting goal", error);
        }
    };

    const handleAddFunds = async (e, goal) => {
        e.preventDefault();
        const amountToAdd = parseFloat(e.target.amount.value);
        if (!amountToAdd || amountToAdd <= 0) return;

        try {
            const token = currentUser.token;
            const updatedGoal = { ...goal, currentSaved: goal.currentSaved + amountToAdd };
            await axios.put(`http://localhost:8080/api/goals/${goal.id}`, updatedGoal, {
                headers: { Authorization: `Bearer ${token}` }
            });
            e.target.reset();
            fetchGoals();
        } catch (error) {
            console.error("Error updating goal", error);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-fintech-primary">Savings Goals</h2>

            {/* Add Goal Form */}
            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Add New Goal</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input
                        type="text"
                        name="goalName"
                        placeholder="Goal Name"
                        value={formData.goalName}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                    />
                    <input
                        type="number"
                        name="targetAmount"
                        placeholder="Target Amount"
                        value={formData.targetAmount}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                    />
                    <input
                        type="number"
                        name="currentSaved"
                        placeholder="Current Saved"
                        value={formData.currentSaved}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                    />
                    <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                    <div className="lg:col-span-4 flex justify-end">
                        <button type="submit" className="btn-primary">Add Goal</button>
                    </div>
                </form>
            </div>

            {/* Goals List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goals.map((g) => {
                    const progress = Math.min((g.currentSaved / g.targetAmount) * 100, 100);
                    return (
                        <div key={g.id} className="card">
                            <div className="flex justify-between">
                                <h4 className="text-lg font-bold">{g.goalName}</h4>
                                <button onClick={() => handleDelete(g.id)} className="text-red-500">&times;</button>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Saved: ₹{g.currentSaved}</span>
                                    <span>Target: ₹{g.targetAmount}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-fintech-success h-2.5 rounded-full"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>{progress.toFixed(1)}%</span>
                                    <span>Deadline: {g.deadline || 'No deadline'}</span>
                                </div>
                                <form onSubmit={(e) => handleAddFunds(e, g)} className="mt-4 pt-4 border-t border-gray-100 flex gap-2 items-center">
                                    <input
                                        type="number"
                                        name="amount"
                                        placeholder="Add funds..."
                                        className="input-field text-sm py-1.5 px-3 h-9 w-full"
                                        required
                                        min="1"
                                        step="0.01"
                                    />
                                    <button type="submit" className="bg-fintech-primary text-white text-sm font-medium px-4 rounded hover:bg-blue-700 transition duration-150 h-9 whitespace-nowrap">
                                        Add
                                    </button>
                                </form>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Goals;
