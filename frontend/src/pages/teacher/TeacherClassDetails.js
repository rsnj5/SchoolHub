import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
import TableTemplate from "../../components/TableTemplate";
import "../styles/TeacherClassDetails.css";

const TeacherClassDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { sclassStudents, loading, error, getresponse } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector((state) => state.user);
    
    const classID = currentUser.teachSclass?._id;
    const subjectID = currentUser.teachSubject?._id;

    useEffect(() => {
        dispatch(getClassStudents(classID));
    }, [dispatch, classID]);

    if (error) {
        console.error(error);
    }

    const studentColumns = [
        { id: "name", label: "Name", minWidth: 170 },
        { id: "rollNum", label: "Roll Number", minWidth: 100 },
        { id: "actions", label: "Actions", minWidth: 200 }
    ];

    const studentRows = sclassStudents.map((student) => ({
        name: student.name,
        rollNum: student.rollNum,
        id: student._id,
    }));

    const StudentsButtonHaver = ({ row }) => {
        return (
            <div className="button-group">
                <button className="primary-btn" onClick={() => navigate(`/Teacher/class/student/${row.id}`)}>
                    View
                </button>
                <button className="secondary-btn" onClick={() => navigate(`/Teacher/class/student/attendance/${row.id}/${subjectID}`)}>
                    Take Attendance
                </button>
                <button className="secondary-btn" onClick={() => navigate(`/Teacher/class/student/marks/${row.id}/${subjectID}`)}>
                    Provide Marks
                </button>
            </div>
        );
    };

    return (
        <div className="teacher-class-container">
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    <h2 className="title">Class Details</h2>
                    {getresponse ? (
                        <p className="no-students">No Students Found</p>
                    ) : (
                        <div className="students-list">
                            <h3>Students List:</h3>
                            {Array.isArray(sclassStudents) && sclassStudents.length > 0 && (
                                <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TeacherClassDetails;
