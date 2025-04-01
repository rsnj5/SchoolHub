import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from "@mui/icons-material/Home";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import ReportIcon from '@mui/icons-material/Report';
import AssignmentIcon from '@mui/icons-material/Assignment';
import '../styles/NavBar.css';  // Import the CSS file

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="nav-left">
                <div className="nav-item">
                    <Link to="/" className={location.pathname === "/" ? "active" : ""}>
                        <HomeIcon className="nav-icon" />
                        <span>Home</span>
                    </Link>
                </div>
                <div className="nav-item">
                    <Link to="/Admin/classes" className={location.pathname.startsWith("/Admin/classes") ? "active" : ""}>
                        <ClassOutlinedIcon className="nav-icon" />
                        <span>Classes</span>
                    </Link>
                </div>
                <div className="nav-item">
                    <Link to="/Admin/subjects" className={location.pathname.startsWith("/Admin/subjects") ? "active" : ""}>
                        <AssignmentIcon className="nav-icon" />
                        <span>Subjects</span>
                    </Link>
                </div>
                <div className="nav-item">
                    <Link to="/Admin/teachers" className={location.pathname.startsWith("/Admin/teachers") ? "active" : ""}>
                        <SupervisorAccountOutlinedIcon className="nav-icon" />
                        <span>Teachers</span>
                    </Link>
                </div>
                <div className="nav-item">
                    <Link to="/Admin/students" className={location.pathname.startsWith("/Admin/students") ? "active" : ""}>
                        <PersonOutlineIcon className="nav-icon" />
                        <span>Students</span>
                    </Link>
                </div>
                <div className="nav-item">
                    <Link to="/Admin/notices" className={location.pathname.startsWith("/Admin/notices") ? "active" : ""}>
                        <AnnouncementOutlinedIcon className="nav-icon" />
                        <span>Notices</span>
                    </Link>
                </div>
                <div className="nav-item">
                    <Link to="/Admin/complains" className={location.pathname.startsWith("/Admin/complains") ? "active" : ""}>
                        <ReportIcon className="nav-icon" />
                        <span>Complains</span>
                    </Link>
                </div>
            </div>

            {/* Right-side User Section */}
            <div className="nav-right">
                <div className="nav-item">
                    <Link to="/Admin/profile" className={location.pathname.startsWith("/Admin/profile") ? "active" : ""}>
                        <AccountCircleOutlinedIcon className="nav-icon" />
                        <span>Profile</span>
                    </Link>
                </div>
                <div className="nav-item">
                    <Link to="/logout" className={location.pathname.startsWith("/logout") ? "active" : ""}>
                        <ExitToAppIcon className="nav-icon" />
                        <span>Logout</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
