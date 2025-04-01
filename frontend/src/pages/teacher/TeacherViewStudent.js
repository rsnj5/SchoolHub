// TeacherViewStudent.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom';
import CustomPieChart from '../../components/CustomPieChart';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';
import '../styles/TeacherViewStudent.css';

const TeacherViewStudent = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);

    const studentID = params.id;
    const teachSubject = currentUser.teachSubject?.subName;
    const teachSubjectID = currentUser.teachSubject?._id;

    useEffect(() => {
        dispatch(getUserDetails(studentID, "Student"));
    }, [dispatch, studentID]);

    const [studentInfo, setStudentInfo] = useState({
        className: {},
        schoolName: {},
        subjectMarks: [],
        subjectAttendance: []
    });

    const [openStates, setOpenStates] = useState({});

    const toggleDetails = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId]
        }));
    };

    useEffect(() => {
        if (userDetails) {
            setStudentInfo({
                className: userDetails.sclassName || {},
                schoolName: userDetails.school || {},
                subjectMarks: userDetails.examResult || [],
                subjectAttendance: userDetails.attendance || []
            });
        }
    }, [userDetails]);

    const overallAttendancePercentage = calculateOverallAttendancePercentage(studentInfo.subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;
    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    return (
        <div className="student-container">
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    <div className="student-info">
                        <p><strong>Name:</strong> {userDetails.name}</p>
                        <p><strong>Roll Number:</strong> {userDetails.rollNum}</p>
                        <p><strong>Class:</strong> {studentInfo.className?.sclassName || 'N/A'}</p>
                        <p><strong>School:</strong> {studentInfo.schoolName?.schoolName || 'N/A'}</p>
                    </div>

                    <h3>Attendance</h3>
                    {studentInfo.subjectAttendance.length > 0 && (
                        <>
                            {Object.entries(groupAttendanceBySubject(studentInfo.subjectAttendance)).map(([subName, { present, allData, subId, sessions }]) => {
                                if (subName === teachSubject) {
                                    return (
                                        <div key={subId} className="attendance-section">
                                            <div className="attendance-header" onClick={() => toggleDetails(subId)}>
                                                <span><strong>{subName}</strong> - {present}/{sessions} ({calculateSubjectAttendancePercentage(present, sessions)}%)</span>
                                                <button className="toggle-btn">{openStates[subId] ? '-' : '+'}</button>
                                            </div>
                                            {openStates[subId] && (
                                                <div className="attendance-details">
                                                    {allData.map((data, index) => (
                                                        <p key={index}><strong>{new Date(data.date).toISOString().substring(0, 10)}:</strong> {data.status}</p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                                return null;
                            })}
                            <div className="attendance-summary">
                                Overall Attendance: {overallAttendancePercentage.toFixed(2)}%
                            </div>
                            <CustomPieChart data={chartData} />
                        </>
                    )}

                    <button className="action-btn" onClick={() => navigate(`/Teacher/class/student/attendance/${studentID}/${teachSubjectID}`)}>Add Attendance</button>

                    <h3>Subject Marks</h3>
                    {studentInfo.subjectMarks.length > 0 && (
                        <div className="marks-table">
                            {studentInfo.subjectMarks.map((result, index) => (
                                result.subName.subName === teachSubject ? (
                                    <div key={index} className="marks-row">
                                        <span><strong>{result.subName.subName}:</strong> {result.marksObtained}</span>
                                    </div>
                                ) : null
                            ))}
                        </div>
                    )}

                    <button className="action-btn" onClick={() => navigate(`/Teacher/class/student/marks/${studentID}/${teachSubjectID}`)}>Add Marks</button>
                </>
            )}
        </div>
    );
};

export default TeacherViewStudent;