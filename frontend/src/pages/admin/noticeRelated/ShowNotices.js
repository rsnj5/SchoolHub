import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getAllNotices, deleteNotice, deleteAllNotices } from '../../../redux/noticeRelated/noticeHandle';
import { GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';
import '../../styles/ShowNotices.css';

const ShowNotices = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { noticesList, loading, error, response } = useSelector((state) => state.notice);
    
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        dispatch(getAllNotices(currentUser._id, "Notice"));
    }, [currentUser._id, dispatch]);

    useEffect(() => {
        if (response) {
            setMessage(response);
            setShowPopup(true);
        } else if (error) {
            setMessage(error);
            setShowPopup(true);
        }
    }, [response, error]);

    const handleDeleteNotice = (noticeId) => {
        if (window.confirm("Are you sure you want to delete this notice?")) {
            dispatch(deleteNotice(noticeId))
                .then(() => {
                    setMessage("Notice deleted successfully");
                    setShowPopup(true);
                })
                .catch((error) => {
                    setMessage(`Failed to delete notice: ${error.message}`);
                    setShowPopup(true);
                });
        }
    };

    const handleDeleteAllNotices = () => {
        if (window.confirm("Are you sure you want to delete ALL notices? This cannot be undone.")) {
            dispatch(deleteAllNotices(currentUser._id))
                .then(() => {
                    setMessage("All notices deleted successfully");
                    setShowPopup(true);
                })
                .catch((error) => {
                    setMessage(`Failed to delete notices: ${error.message}`);
                    setShowPopup(true);
                });
        }
    };

    const noticeColumns = [
        { id: 'title', label: 'Title', minWidth: 170 },
        { id: 'details', label: 'Details', minWidth: 200 },
        { id: 'date', label: 'Date', minWidth: 120 },
        { 
            id: 'actions', 
            label: 'Actions', 
            minWidth: 120,
            align: 'center'
        },
    ];

    const noticeRows = noticesList?.map((notice) => {
        const date = new Date(notice.date);
        const dateString = date.toString() !== "Invalid Date" 
            ? date.toISOString().substring(0, 10) 
            : "Invalid Date";
        return {
            title: notice.title,
            details: notice.details,
            date: dateString,
            id: notice._id,
        };
    }) || [];

    const actions = [
        {
            icon: <span className="add-icon">+</span>, 
            name: 'Add New Notice',
            action: () => navigate("/Admin/addnotice")
        },
        {
            icon: <span className="delete-icon">×</span>, 
            name: 'Delete All Notices',
            action: handleDeleteAllNotices
        }
    ];

    const renderTable = () => {
        return (
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            {noticeColumns.map((column) => (
                                <th key={column.id} style={{ minWidth: column.minWidth }}>
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {noticeRows.map((row, index) => (
                            <tr key={index}>
                                {noticeColumns.map((column) => {
                                    if (column.id === 'actions') {
                                        return (
                                            <td key={column.id}>
                                                <button 
                                                    className="delete-button" 
                                                    onClick={() => handleDeleteNotice(row.id)}
                                                    title="Delete Notice"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        );
                                    }
                                    return (
                                        <td key={column.id}>
                                            {row[column.id]}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="notices-container">
            <div className="header-section">
                <h2>School Notices</h2>
                <div className="controls">
                    <GreenButton 
                        onClick={() => navigate("/Admin/addnotice")}
                    >
                        Add New Notice
                    </GreenButton>
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading notices...</div>
            ) : error ? (
                <div className="error">Error loading notices: {error}</div>
            ) : noticesList?.length > 0 ? (
                <>
                    {renderTable()}
                    <SpeedDialTemplate actions={actions} />
                </>
            ) : (
                <div className="no-notices">
                    <p>No notices found</p>
                    <GreenButton 
                        onClick={() => navigate("/Admin/addnotice")}
                    >
                        Create Your First Notice
                    </GreenButton>
                </div>
            )}

            <Popup
                title="Message"
                openPopup={showPopup}
                setOpenPopup={setShowPopup}
            >
                <div className="message-popup">
                    <p>{message}</p>
                    <button 
                        className="ok-button"
                        onClick={() => setMessage("")}
                    >
                        OK
                    </button>
                </div>
            </Popup>
        </div>
    );
};

export default ShowNotices;