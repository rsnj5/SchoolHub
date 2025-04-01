import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Popup from '../components/Popup';
import './styles/HomePage.css';

const ChooseUser = () => {
    const navigate = useNavigate();
    const { status, currentUser, currentRole } = useSelector(state => state.user);
    
    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const navigateHandler = (user) => {
        if (user === "Admin") {
            navigate('/Adminlogin');
        }  else if (user === "Teacher") {
            navigate('/Teacherlogin');
        }
    };

    useEffect(() => {
        if (status === 'success' && currentUser) {
            if (currentRole === 'Admin') {
                navigate('/Admin/dashboard');
            }  else if (currentRole === 'Teacher') {
                navigate('/Teacher/dashboard');
            }
        } else if (status === 'error') {
            setLoader(false);
            setMessage("Network Error");
            setShowPopup(true);
        }
    }, [status, currentRole, navigate, currentUser]);

    return (
        <div className="content">
            <h1>Choose Your Role</h1>
            <p>Select your role to access the appropriate dashboard.</p>
            <div className="buttons">
                <button onClick={() => navigateHandler("Admin")} className="login-btn">Admin</button>
                <button onClick={() => navigateHandler("Teacher")} className="signup-btn">Teacher</button>
            </div>

            {loader && (
                <div className="loader-overlay">
                    <div className="loader"></div>
                    <p>Please Wait...</p>
                </div>
            )}

            {showPopup && <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />}
        </div>
    );
};

export default ChooseUser;
