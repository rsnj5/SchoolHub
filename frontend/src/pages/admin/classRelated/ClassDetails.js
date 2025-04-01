import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getClassDetails, getClassStudents, getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import Popup from "../../../components/Popup";
import "../../styles/ClassDetails.css";

const TableTemplate = ({ columns, rows, buttonHaver }) => {
    return (
        <div className="table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.id}>{column.label}</th>
                        ))}
                        {buttonHaver && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id}>
                            {columns.map((column) => (
                                <td key={`${row.id}-${column.id}`}>
                                    {row[column.id]}
                                </td>
                            ))}
                            {buttonHaver && (
                                <td>
                                    <buttonHaver row={row} />
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const ClassDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { subjectsList, sclassStudents, sclassDetails, loading, error, response, getresponse } = useSelector((state) => state.sclass);

    const classID = params.id;

    useEffect(() => {
        dispatch(getClassDetails(classID, "Sclass"));
        dispatch(getSubjectList(classID, "ClassSubjects"));
        dispatch(getClassStudents(classID));
    }, [dispatch, classID]);

    const [activeTab, setActiveTab] = useState('1');
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        setMessage("Sorry, the delete function has been disabled for now.");
        setShowPopup(true);
    };

    const subjectColumns = [
        { id: 'name', label: 'Subject Name' },
        { id: 'code', label: 'Subject Code' }
    ];

    const subjectRows = subjectsList?.map((subject) => ({
        name: subject?.subName || "N/A",
        code: subject?.subCode || "N/A",
        id: subject?._id || ""
    })) || [];

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <div className="button-group">
                <button 
                    className="action-button delete-button"
                    onClick={() => deleteHandler(row.id, "Subject")}
                >
                    Delete
                </button>
                <button 
                    className="action-button view-button"
                    onClick={() => navigate(`/Admin/class/subject/${classID}/${row.id}`)}
                >
                    View
                </button>
            </div>
        );
    };

    const studentColumns = [
        { id: 'name', label: 'Name' },
        { id: 'rollNum', label: 'Roll Number' }
    ];

    const studentRows = sclassStudents?.map((student) => ({
        name: student?.name || "N/A",
        rollNum: student?.rollNum || "N/A",
        id: student?._id || ""
    })) || [];

    const StudentsButtonHaver = ({ row }) => {
        return (
            <div className="button-group">
                <button 
                    className="action-button delete-button"
                    onClick={() => deleteHandler(row.id, "Student")}
                >
                    Remove
                </button>
                <button 
                    className="action-button view-button"
                    onClick={() => navigate(`/Admin/students/student/${row.id}`)}
                >
                    View
                </button>
            </div>
        );
    };

    return (
        <div className="class-details-container">
            {loading ? (
                <div className="loading-message">Loading...</div>
            ) : error ? (
                <div className="error-message">Error: {error.message}</div>
            ) : (
                <div className="tab-container">
                    <div className="tab-header">
                        <button 
                            className={`tab-button ${activeTab === '1' ? 'active' : ''}`}
                            onClick={() => setActiveTab('1')}
                        >
                            Details
                        </button>
                        <button 
                            className={`tab-button ${activeTab === '2' ? 'active' : ''}`}
                            onClick={() => setActiveTab('2')}
                        >
                            Subjects
                        </button>
                        <button 
                            className={`tab-button ${activeTab === '3' ? 'active' : ''}`}
                            onClick={() => setActiveTab('3')}
                        >
                            Students
                        </button>
                        <button 
                            className={`tab-button ${activeTab === '4' ? 'active' : ''}`}
                            onClick={() => setActiveTab('4')}
                        >
                            Teachers
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTab === '1' && (
                            <div className="section">
                                <h2>Class Details</h2>
                                <p>Class Name: {sclassDetails?.sclassName || "N/A"}</p>
                                <p>Number of Subjects: {subjectsList?.length || 0}</p>
                                <p>Number of Students: {sclassStudents?.length || 0}</p>
                                <div className="button-group" style={{ marginTop: '1.5rem' }}>
                                    {response && (
                                        <button 
                                            className="action-button view-button"
                                            onClick={() => navigate("/Admin/addsubject/" + classID)}
                                        >
                                            Add Subjects
                                        </button>
                                    )}
                                    {getresponse && (
                                        <button 
                                            className="action-button view-button"
                                            onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                                        >
                                            Add Students
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === '2' && (
                            <div className="section">
                                <h2>Subjects</h2>
                                {subjectRows.length > 0 ? (
                                    <TableTemplate 
                                        columns={subjectColumns} 
                                        rows={subjectRows} 
                                        buttonHaver={SubjectsButtonHaver}
                                    />
                                ) : (
                                    <p>No subjects found.</p>
                                )}
                            </div>
                        )}

                        {activeTab === '3' && (
                            <div className="section">
                                <h2>Students</h2>
                                {studentRows.length > 0 ? (
                                    <TableTemplate 
                                        columns={studentColumns} 
                                        rows={studentRows} 
                                        buttonHaver={StudentsButtonHaver}
                                    />
                                ) : (
                                    <p>No students found.</p>
                                )}
                            </div>
                        )}

                        {activeTab === '4' && (
                            <div className="section">
                                <h2>Teachers</h2>
                                <p>Teacher information will be displayed here.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </div>
    );
};

export default ClassDetails;