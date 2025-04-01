import { useState } from 'react';
import { Navigate, Route, Routes, Link } from 'react-router-dom';
import Logout from '../Logout';
import StudentAttendance from '../admin/studentRelated/StudentAttendance';
import TeacherClassDetails from './TeacherClassDetails';
import TeacherComplain from './TeacherComplain';
import TeacherHomePage from './TeacherHomePage';
import TeacherProfile from './TeacherProfile';
import TeacherViewStudent from './TeacherViewStudent';
import StudentExamMarks from '../admin/studentRelated/StudentExamMarks';
import '../styles/TeacherDashboard.css';

const TeacherDashboard = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="dashboard-container">
           
            <header className="navbar">
                <button onClick={toggleMenu} className="menu-button">☰</button>
                <h1 className="dashboard-title">Teacher Dashboard</h1>
                <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
                    <Link to="/Teacher/dashboard" onClick={toggleMenu}>Home</Link>
                    <Link to="/Teacher/profile" onClick={toggleMenu}>Profile</Link>
                    <Link to="/Teacher/complain" onClick={toggleMenu}>Complaints</Link>
                    <Link to="/Teacher/class" onClick={toggleMenu}>Classes</Link>
                    <Link to="/logout" onClick={toggleMenu} className="logout-btn">Logout</Link>
                </nav>
            </header>

            {/* Main Content */}
            <div className="content-area">
                <Routes>
                    <Route path="/" element={<TeacherHomePage />} />
                    <Route path='*' element={<Navigate to="/" />} />
                    <Route path="/Teacher/dashboard" element={<TeacherHomePage />} />
                    <Route path="/Teacher/profile" element={<TeacherProfile />} />
                    <Route path="/Teacher/complain" element={<TeacherComplain />} />
                    <Route path="/Teacher/class" element={<TeacherClassDetails />} />
                    <Route path="/Teacher/class/student/:id" element={<TeacherViewStudent />} />
                    <Route path="/Teacher/class/student/attendance/:studentID/:subjectID" element={<StudentAttendance situation="Subject" />} />
                    <Route path="/Teacher/class/student/marks/:studentID/:subjectID" element={<StudentExamMarks situation="Subject" />} />
                    <Route path="/logout" element={<Logout />} />
                </Routes>
            </div>
        </div>
    );
};

export default TeacherDashboard;
