import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChartPie, FaList, FaWallet, FaBullseye, FaUserCircle, FaShieldAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { currentUser } = useContext(AuthContext);

    const isAdmin = currentUser && currentUser.roles && currentUser.roles.includes("ROLE_ADMIN");

    const menuItems = [
        { path: "/dashboard", name: "Dashboard", icon: <FaChartPie /> },
        { path: "/transactions", name: "Transactions", icon: <FaList /> },
        { path: "/budgets", name: "Budgets", icon: <FaWallet /> },
        { path: "/goals", name: "Goals", icon: <FaBullseye /> },
        { path: "/profile", name: "Profile", icon: <FaUserCircle /> },
    ];

    if (isAdmin) {
        menuItems.unshift({ path: "/admin", name: "Admin Panel", icon: <FaShieldAlt /> });
    }

    return (
        <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 pt-20 shadow-xl">
            <div className="flex flex-col gap-2 p-4">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${location.pathname === item.path
                            ? "bg-blue-600 text-white shadow-md transform scale-105"
                            : "hover:bg-slate-800 text-slate-300 hover:text-white"
                            }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                    </Link>
                ))}
            </div>

            <div className="mt-auto p-6 border-t border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
                        {currentUser?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-semibold">{currentUser?.username}</p>
                        <p className="text-xs text-slate-400 capitalize">{currentUser?.roles?.[0]?.replace('ROLE_', '').toLowerCase()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
