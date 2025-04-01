import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';
import './styles/LoginPage.css';

const LoginPage = ({ role }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);

    const [toggle, setToggle] = useState(false);
    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    
    const handleSubmit = (event) => {
        event.preventDefault();

       
            const email = event.target.email.value;
            const password = event.target.password.value;

            if (!email || !password) {
                if (!email) setEmailError(true);
                if (!password) setPasswordError(true);
                return;
            }
            const fields = { email, password };
            setLoader(true);
            dispatch(loginUser(fields, role));
        
    };

    useEffect(() => {
        if (status === 'success' || currentUser !== null) {
            if (currentRole === 'Admin') {
                navigate('/Admin/dashboard');
            }  else if (currentRole === 'Teacher') {
                navigate('/Teacher/dashboard');
            }
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, currentRole, navigate, error, response, currentUser]);

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">{role} Login</h2>
                <p className="login-subtitle">Welcome back! Please enter your details</p>
                <form onSubmit={handleSubmit} className="login-form">
                <input type="email" id="email" name="email" placeholder="Enter your email" className={`login-input ${emailError ? 'error' : ''}`} />

                   
                    <input type={toggle ? 'text' : 'password'} id="password" name="password" placeholder="Password" className={`login-input ${passwordError ? 'error' : ''}`} />
                    <button type="submit" className="login-button">{loader ? "Loading..." : "Login"}</button>
                </form>
            </div>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </div>
    );
}

export default LoginPage;
