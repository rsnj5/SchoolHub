import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authLogout } from '../redux/userRelated/userSlice';

const Logout = () => {
    const currentUser = useSelector(state => state.user.currentUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(authLogout());
        navigate('/');
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-8 text-center w-80">
                <h1 className="text-2xl font-semibold mb-4 text-gray-800">{currentUser?.name}</h1>
                <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={handleLogout} 
                        className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition">
                        Log Out
                    </button>
                    <button 
                        onClick={handleCancel} 
                        className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 transition">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Logout;