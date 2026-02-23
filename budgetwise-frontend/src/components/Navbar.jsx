import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
    const { currentUser, logout } = useContext(AuthContext);

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-fintech-primary">BudgetWise</h1>
            <div className="flex items-center gap-4">
                <span className="text-gray-600 flex items-center gap-2">
                    <FaUserCircle /> {currentUser?.username}
                </span>
                <button onClick={logout} className="text-gray-500 hover:text-red-500 flex items-center gap-2">
                    <FaSignOutAlt /> Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
