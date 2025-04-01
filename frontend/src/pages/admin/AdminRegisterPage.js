import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/userRelated/userHandle';
import Popup from '../../components/Popup';
import '../styles/AdminRegister.css';

const AdminRegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);

    const [showPassword, setShowPassword] = useState(false);
    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [errors, setErrors] = useState({
        adminName: false,
        schoolName: false,
        email: false,
        password: false
    });

    const role = "Admin";

    const handleSubmit = (event) => {
        event.preventDefault();

        const name = event.target.adminName.value;
        const schoolName = event.target.schoolName.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        const newErrors = {
            adminName: !name,
            schoolName: !schoolName,
            email: !email,
            password: !password
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error)) {
            return;
        }

        const fields = { name, email, password, role, schoolName };
        setLoader(true);
        dispatch(registerUser(fields, role));
    };

    const handleInputChange = (event) => {
        const { name } = event.target;
        setErrors(prev => ({ ...prev, [name]: false }));
    };

    useEffect(() => {
        if (status === 'success' || (currentUser !== null && currentRole === 'Admin')) {
            navigate('/Admin/dashboard');
        }
        else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        }
        else if (status === 'error') {
            console.log(error);
        }
    }, [status, currentUser, currentRole, navigate, error, response]);

    return (
        <div className="admin-register-page">
            <div className="register-container">
                <div className="register-form-container">
                    <div className="form-header">
                        <h1>Create Admin Account</h1>
                        <p>Register to manage your school system</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="register-form">
                        <div className={`form-group ${errors.adminName ? 'error' : ''}`}>
                            <label>Your Full Name</label>
                            <input
                                type="text"
                                name="adminName"
                                placeholder="Enter your name"
                                onChange={handleInputChange}
                            />
                            {errors.adminName && <span className="error-message">Name is required</span>}
                        </div>

                        <div className={`form-group ${errors.schoolName ? 'error' : ''}`}>
                            <label>School Name</label>
                            <input
                                type="text"
                                name="schoolName"
                                placeholder="Enter school name"
                                onChange={handleInputChange}
                            />
                            {errors.schoolName && <span className="error-message">School name is required</span>}
                        </div>

                        <div className={`form-group ${errors.email ? 'error' : ''}`}>
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                onChange={handleInputChange}
                            />
                            {errors.email && <span className="error-message">Valid email is required</span>}
                        </div>

                        <div className={`form-group ${errors.password ? 'error' : ''}`}>
                            <label>Password</label>
                            <div className="password-input">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Create a password"
                                    onChange={handleInputChange}
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {errors.password && <span className="error-message">Password is required</span>}
                        </div>

                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" />
                                Remember me
                            </label>
                        </div>

                        <button type="submit" className="submit-btn" disabled={loader}>
                            {loader ? (
                                <div className="spinner"></div>
                            ) : (
                                'Create Account'
                            )}
                        </button>

                        <div className="login-redirect">
                            Already have an account? <Link to="/Adminlogin">Sign in</Link>
                        </div>
                    </form>
                </div>
                <div className="register-image">
                    <div className="image-overlay">
                        <h2>School Management System</h2>
                        <p>Efficient tools for administrators to manage students, faculty, and operations</p>
                    </div>
                </div>
            </div>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </div>
    );
};

export default AdminRegisterPage;