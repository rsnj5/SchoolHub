import React from 'react';
import {  useNavigate } from 'react-router-dom';
import './styles/HomePage.css';

const Homepage = () => {
    const Navigate = useNavigate(); 
    return (
        <div className='content'>
           <h1>Elevate your Learning</h1>
           <p>Streamline school management, class organization, and add students and faculty.
                            Seamlessly track attendance, assess performance, and provide feedback.
                            Access records, view marks, and communicate effortlessly.</p>
            <div className='buttons'>
                <button onClick={()=> Navigate('/choose')} className="login-btn">Login</button>
                <button onClick={()=> Navigate('/Adminregister')} className="signup-btn">Signup</button>

                </div>            
        </div>
                
    );
};

export default Homepage;
