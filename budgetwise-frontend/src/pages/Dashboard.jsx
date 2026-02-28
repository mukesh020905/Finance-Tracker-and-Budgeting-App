import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Sector } from 'recharts';

const Dashboard = () => {
    const { currentUser } = useContext(AuthContext);
    const [categoryData, setCategoryData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [aiAdvice, setAiAdvice] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(true);

    const [activeIndex, setActiveIndex] = useState(0);

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

    const renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g>
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-semibold text-lg">
                    {payload.name}
                </text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + 6}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 8}
                    outerRadius={outerRadius + 12}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`₹${value}`}</text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                    {`(${(percent * 100).toFixed(1)}%)`}
                </text>
            </g>
        );
    };

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!currentUser) return;
            try {
                const token = currentUser.token;
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // Fetch Category & Monthly Data in parallel
                const [catRes, monthRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/analytics/category', config),
                    axios.get('http://localhost:8080/api/analytics/monthly', config)
                ]);

                // Process Category Data
                const catArray = Object.keys(catRes.data).map(key => ({
                    name: key,
                    value: catRes.data[key]
                }));
                setCategoryData(catArray);

                // Process Monthly Data
                const monthArray = Object.keys(monthRes.data).map(key => ({
                    name: key,
                    INCOME: monthRes.data[key].INCOME || 0,
                    EXPENSE: monthRes.data[key].EXPENSE || 0
                }));
                setMonthlyData(monthArray);

                setLoading(false); // Charts are ready
            } catch (error) {
                console.error("Error fetching dashboard data", error);
                setLoading(false);
            }
        };

        const fetchAIAdvice = async () => {
            if (!currentUser) return;
            // Delay AI fetch slightly to not compete with initial render
            setAiLoading(true);
            try {
                const token = currentUser.token;
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const aiRes = await axios.get('http://localhost:8080/api/ai/advice', config);
                if (aiRes.data && aiRes.data.length > 0) {
                    setAiAdvice(aiRes.data);
                } else {
                    throw new Error("Empty advice");
                }
            } catch (aiError) {
                console.warn("AI Service generic/failed, using fallback tips.");
                setAiAdvice([
                    "💡 Tip: Start by setting a budget for 'Food' to save up to 15% this month.",
                    "📉 Insight: Track your daily coffee expenses; small adjustments lead to big savings.",
                    "🎯 Goal: Try to save at least 20% of your income for an emergency fund."
                ]);
            } finally {
                setAiLoading(false);
            }
        };

        fetchDashboardData();
        fetchAIAdvice();
    }, [currentUser]);

    const handleDownload = async (type, filename) => {
        if (!currentUser) return;
        try {
            const token = currentUser.token;
            const res = await axios.get(`http://localhost:8080/api/export/${type}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = urlBlob;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error(`Error downloading ${type}`, error);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen text-blue-600">
            <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading Dashboard...
        </div>
    );

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Financial Dashboard</h2>
                    <p className="text-gray-600">Welcome back, {currentUser.username}!</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => handleDownload('pdf', 'transactions.pdf')} className="btn-secondary text-sm px-3 py-1.5 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        PDF
                    </button>
                    <button onClick={() => handleDownload('csv', 'transactions.csv')} className="btn-secondary text-sm px-3 py-1.5 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        CSV
                    </button>
                    <button onClick={() => handleDownload('backup', 'budgetwise_backup.json')} className="bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm px-3 py-1.5 flex items-center gap-1 font-medium transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Backup Data
                    </button>
                </div>
            </header>

            {/* AI Advice Section */}
            <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
                    <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600 transform rotate-12">
                        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" /><path d="M12 6a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V7a1 1 0 0 0-1-1zm0 8a1.2 1.2 0 1 0 1.2 1.2A1.2 1.2 0 0 0 12 14z" />
                    </svg>
                </div>

                <div className="flex items-start gap-4 z-10 relative">
                    <div className="bg-white p-3 rounded-full text-blue-600 shadow-sm border border-blue-100">
                        <span className="text-2xl">✨</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-semibold text-blue-900">Smart Financial Advisor</h3>
                            {aiLoading && (
                                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full flex items-center gap-1">
                                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Analyzing...
                                </span>
                            )}
                            {!aiLoading && <span className="text-xs font-medium text-indigo-500 border border-indigo-200 px-2 py-1 rounded bg-white">Powered by Gemini AI</span>}
                        </div>

                        {aiLoading ? (
                            <div className="space-y-3 animate-pulse">
                                <div className="h-4 bg-blue-200 rounded w-3/4"></div>
                                <div className="h-4 bg-blue-200 rounded w-1/2"></div>
                                <div className="h-4 bg-blue-200 rounded w-5/6"></div>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {aiAdvice.map((advice, index) => (
                                    <li key={index} className="flex items-start gap-2 text-blue-800 bg-white/50 p-2 rounded-lg hover:bg-white transition-colors duration-200">
                                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                                        <span className="leading-relaxed">{advice}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Spending Pie Chart */}
                <div className="card">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Expense by Category</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    activeIndex={activeIndex}
                                    activeShape={renderActiveShape}
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    dataKey="value"
                                    onMouseEnter={onPieEnter}
                                    isAnimationActive={true}
                                    animationDuration={1500}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-90 outline-none" stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', backdropFilter: 'blur(8px)' }}
                                    itemStyle={{ color: '#1e293b', fontWeight: '500' }}
                                    formatter={(value) => `$${value}`}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Monthly Income vs Expense Bar Chart */}
                <div className="card">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Monthly Income vs Expense</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData} barGap={10} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.3} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.3} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc', opacity: 0.6 }}
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', backdropFilter: 'blur(8px)' }}
                                    formatter={(value) => `₹${value}`}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                                <Bar dataKey="INCOME" fill="url(#colorIncome)" radius={[6, 6, 0, 0]} maxBarSize={45} isAnimationActive={true} animationDuration={1500} />
                                <Bar dataKey="EXPENSE" fill="url(#colorExpense)" radius={[6, 6, 0, 0]} maxBarSize={45} isAnimationActive={true} animationDuration={1500} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
