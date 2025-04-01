import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getAllStudents, removeStuff } from '../../../redux/studentRelated/studentHandle';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';
import '../../styles/ShowStudents.css';

const ShowStudents = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { studentsList, loading, error } = useSelector((state) => state.student);
    const { currentUser } = useSelector(state => state.user);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        dispatch(getAllStudents(currentUser._id));
    }, [currentUser._id, dispatch]);

    const deleteHandler = async (deleteID, address) => {
        if (window.confirm(`Are you sure you want to delete ${address === "Student" ? 'this student' : 'ALL students'}?`)) {
            try {
                await dispatch(removeStuff(deleteID, address));
                setMessage(`${address === "Student" ? 'Student' : 'All students'} deleted successfully`);
                setShowPopup(true);
            } catch (error) {
                setMessage(`Failed to delete ${address === "Student" ? 'student' : 'students'}: ${error.message}`);
                setShowPopup(true);
            }
        }
    };

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
        { id: 'sclassName', label: 'Class', minWidth: 170 },
    ];

    const studentRows = studentsList?.map((student) => ({
        name: student.name,
        rollNum: student.rollNum,
        sclassName: student.sclassName?.sclassName || '',
        id: student._id,
    })) || [];

    const StudentButtonHaver = ({ row }) => (
        <div className="student-actions">
            <button 
                className="delete-button" 
                onClick={() => deleteHandler(row.id, "Student")}
                title="Delete Student"
            >
                <span className="delete-icon">✕</span>
            </button>
            <BlueButton onClick={() => navigate(`/Admin/students/student/${row.id}`)}>
                View
            </BlueButton>
        </div>
    );

    const actions = [
        {
            icon: <span className="add-icon">+</span>, 
            name: 'Add New Student',
            action: () => navigate("/Admin/addstudents")
        },
        {
            icon: <span className="delete-icon">✕</span>, 
            name: 'Delete All Students',
            action: () => deleteHandler(currentUser._id, "Students")
        },
    ];

    return (
        <div className="students-container">
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="students-table-container">
                    {studentsList?.length > 0 ? (
                        <>
                            <table className="students-table">
                                <thead>
                                    <tr>
                                        {studentColumns.map((column) => (
                                            <th key={column.id} style={{ minWidth: column.minWidth }}>
                                                {column.label}
                                            </th>
                                        ))}
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentRows.map((row, index) => (
                                        <tr key={index}>
                                            {studentColumns.map((column) => (
                                                <td key={column.id}>{row[column.id]}</td>
                                            ))}
                                            <td>
                                                <StudentButtonHaver row={row} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <SpeedDialTemplate actions={actions} />
                        </>
                    ) : (
                        <div className="no-students">
                            <p>No students found</p>
                            <GreenButton onClick={() => navigate("/Admin/addstudents")}>
                                Add Students
                            </GreenButton>
                        </div>
                    )}
                </div>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </div>
    );
};

export default ShowStudents;