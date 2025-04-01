import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CountUp from 'react-countup';
import SeeNotice from '../../components/SeeNotice';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import '../styles/AdminHomePage.css';

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector(state => state.user);

    const adminID = currentUser._id;

    useEffect(() => {
        dispatch(getAllStudents(adminID));
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));
    }, [adminID, dispatch]);

    const numberOfStudents = studentsList && studentsList.length;
    const numberOfClasses = sclassesList && sclassesList.length;
    const numberOfTeachers = teachersList && teachersList.length;

    return (
        <div className="admin-dashboard">
            <h1 className="dashboard-title"> Overview</h1>
            
            <div className="stats-grid">
                <div className="stat-card students">
                    <h3>Students</h3>
                    <CountUp 
                        className="stat-value"
                        start={0} 
                        end={numberOfStudents} 
                        duration={2.5} 
                    />
                    <p className="stat-description">Total enrolled students</p>
                </div>
                
                <div className="stat-card classes">
                    <h3>Classes</h3>
                    <CountUp 
                        className="stat-value"
                        start={0} 
                        end={numberOfClasses} 
                        duration={5} 
                    />
                    <p className="stat-description">Active classes</p>
                </div>
                
                <div className="stat-card teachers">
                    <h3>Teachers</h3>
                    <CountUp 
                        className="stat-value"
                        start={0} 
                        end={numberOfTeachers} 
                        duration={2.5} 
                    />
                    <p className="stat-description">Teaching staff</p>
                </div>
                
                <div className="stat-card revenue">
                    <h3>Revenue</h3>
                    <CountUp 
                        className="stat-value"
                        start={0} 
                        end={23000} 
                        duration={2.5} 
                        prefix="$" 
                    />
                    <p className="stat-description">This month's collection</p>
                </div>
            </div>
            
            <div className="notice-section">
                <h2 className="section-title">Recent Notices</h2>
                <SeeNotice />
            </div>
        </div>
    );
};

export default AdminHomePage;