import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getUserDetails, updateUser } from '../../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { Box, Button, Collapse, IconButton, Table, TableBody, TableHead, Typography, Tab, Paper, BottomNavigation, BottomNavigationAction, Container } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { KeyboardArrowUp, KeyboardArrowDown, Delete as DeleteIcon } from '@mui/icons-material';
import { removeStuff, updateStudentFields } from '../../../redux/studentRelated/studentHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../../components/attendanceCalculator';
import CustomBarChart from '../../../components/CustomBarChart';
import CustomPieChart from '../../../components/CustomPieChart';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import Popup from '../../../components/Popup';

const ViewStudent = () => {
    const [showTabState, setShowTabState] = useState(false);

    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { userDetails, response, loading, error } = useSelector((state) => state.user);

    const studentId = params.id;
    const address = "Student";

    useEffect(() => {
        dispatch(getUserDetails(studentId, address));
    }, [dispatch, studentId]);

    useEffect(() => {
        if (userDetails && userDetails.sclassName && userDetails.sclassName._id !== undefined) {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails]);

    if (response) { console.log(response); }
    else if (error) { console.log(error); }

    const [studentName, setStudentName] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [studentPassword, setStudentPassword] = useState('');
    const [studentClass, setStudentClass] = useState('');
    const [schoolInfo, setSchoolInfo] = useState('');
    const [examResults, setExamResults] = useState('');
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    const [openCollapseStates, setOpenCollapseStates] = useState({});

    const [popupVisible, setPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");

    const handleCollapseToggle = (subId) => {
        setOpenCollapseStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    const [activeTab, setActiveTab] = useState('1');

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const [currentView, setCurrentView] = useState('table');
    const handleViewChange = (event, newView) => {
        setCurrentView(newView);
    };

    const updateFields = studentPassword === ""
        ? { name: studentName, rollNum: rollNumber }
        : { name: studentName, rollNum: rollNumber, password: studentPassword };

    useEffect(() => {
        if (userDetails) {
            setStudentName(userDetails.name || '');
            setRollNumber(userDetails.rollNum || '');
            setStudentClass(userDetails.sclassName || '');
            setSchoolInfo(userDetails.school || '');
            setExamResults(userDetails.examResult || '');
            setAttendanceRecords(userDetails.attendance || []);
        }
    }, [userDetails]);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        dispatch(updateUser(updateFields, studentId, address))
            .then(() => {
                dispatch(getUserDetails(studentId, address));
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleDelete = () => {
        setPopupMessage("Sorry the delete function has been disabled for now.");
        setPopupVisible(true);
    };

    const handleRemove = (id, delAddress) => {
        dispatch(removeStuff(id, delAddress))
            .then(() => {
                dispatch(getUserDetails(studentId, address));
            });
    };

    const handleRemoveAttendance = (subId) => {
        dispatch(updateStudentFields(studentId, { subId }, "RemoveStudentSubAtten"))
            .then(() => {
                dispatch(getUserDetails(studentId, address));
            });
    };

    const overallAttendancePercentage = calculateOverallAttendancePercentage(attendanceRecords);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const attendanceChartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    const subjectWiseData = Object.entries(groupAttendanceBySubject(attendanceRecords)).map(([subName, { subCode, present, sessions }]) => {
        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
        return {
            subject: subName,
            attendancePercentage: subjectAttendancePercentage,
            totalClasses: sessions,
            attendedClasses: present
        };
    });

    const AttendanceSection = () => {
        const renderTableSection = () => {
            return (
                <div className="attendance-table-section">
                    <h3>Attendance:</h3>
                    <Table className="attendance-table">
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Subject</StyledTableCell>
                                <StyledTableCell>Present</StyledTableCell>
                                <StyledTableCell>Total Sessions</StyledTableCell>
                                <StyledTableCell>Attendance Percentage</StyledTableCell>
                                <StyledTableCell align="center">Actions</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        {Object.entries(groupAttendanceBySubject(attendanceRecords)).map(([subName, { present, allData, subId, sessions }], index) => {
                            const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
                            return (
                                <TableBody key={index}>
                                    <StyledTableRow>
                                        <StyledTableCell>{subName}</StyledTableCell>
                                        <StyledTableCell>{present}</StyledTableCell>
                                        <StyledTableCell>{sessions}</StyledTableCell>
                                        <StyledTableCell>{subjectAttendancePercentage}%</StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Button variant="contained"
                                                onClick={() => handleCollapseToggle(subId)}>
                                                {openCollapseStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}Details
                                            </Button>
                                            <IconButton onClick={() => handleRemoveAttendance(subId)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                            <Button variant="contained" className="attendance-action-button"
                                                onClick={() => navigate(`/Admin/subject/student/attendance/${studentId}/${subId}`)}>
                                                Change
                                            </Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                            <Collapse in={openCollapseStates[subId]} timeout="auto" unmountOnExit>
                                                <Box className="attendance-details-box">
                                                    <Typography variant="h6" gutterBottom component="div">
                                                        Attendance Details
                                                    </Typography>
                                                    <Table size="small" aria-label="purchases">
                                                        <TableHead>
                                                            <StyledTableRow>
                                                                <StyledTableCell>Date</StyledTableCell>
                                                                <StyledTableCell align="right">Status</StyledTableCell>
                                                            </StyledTableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {allData.map((data, index) => {
                                                                const date = new Date(data.date);
                                                                const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                                return (
                                                                    <StyledTableRow key={index}>
                                                                        <StyledTableCell component="th" scope="row">
                                                                            {dateString}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell align="right">{data.status}</StyledTableCell>
                                                                    </StyledTableRow>
                                                                );
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Collapse>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            );
                        })}
                    </Table>
                    <div className="attendance-summary">
                        Overall Attendance Percentage: {overallAttendancePercentage.toFixed(2)}%
                    </div>
                    <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => handleRemove(studentId, "RemoveStudentAtten")}>Delete All</Button>
                    <Button variant="contained" className="add-attendance-button" onClick={() => navigate("/Admin/students/student/attendance/" + studentId)}>
                        Add Attendance
                    </Button>
                </div>
            );
        };

        const renderChartSection = () => {
            return (
                <div className="attendance-chart-section">
                    <CustomBarChart chartData={subjectWiseData} dataKey="attendancePercentage" />
                </div>
            );
        };

        return (
            <div className="attendance-container">
                {attendanceRecords && Array.isArray(attendanceRecords) && attendanceRecords.length > 0
                    ? (
                        <>
                            {currentView === 'table' && renderTableSection()}
                            {currentView === 'chart' && renderChartSection()}

                            <Paper className="view-switcher" elevation={3}>
                                <BottomNavigation value={currentView} onChange={handleViewChange} showLabels>
                                    <BottomNavigationAction
                                        label="Table"
                                        value="table"
                                        icon={currentView === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                    />
                                    <BottomNavigationAction
                                        label="Chart"
                                        value="chart"
                                        icon={currentView === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                    />
                                </BottomNavigation>
                            </Paper>
                        </>
                    )
                    : (
                        <Button variant="contained" className="add-attendance-button" onClick={() => navigate("/Admin/students/student/attendance/" + studentId)}>
                            Add Attendance
                        </Button>
                    )}
            </div>
        );
    };

    const MarksSection = () => {
        const renderTableSection = () => {
            return (
                <div className="marks-table-section">
                    <h3>Subject Marks:</h3>
                    <Table className="marks-table">
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Subject</StyledTableCell>
                                <StyledTableCell>Marks</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {examResults.map((result, index) => {
                                if (!result.subName || !result.marksObtained) {
                                    return null;
                                }
                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{result.subName.subName}</StyledTableCell>
                                        <StyledTableCell>{result.marksObtained}</StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <Button variant="contained" className="add-marks-button" onClick={() => navigate("/Admin/students/student/marks/" + studentId)}>
                        Add Marks
                    </Button>
                </div>
            );
        };

        const renderChartSection = () => {
            return (
                <div className="marks-chart-section">
                    <CustomBarChart chartData={examResults} dataKey="marksObtained" />
                </div>
            );
        };

        return (
            <div className="marks-container">
                {examResults && Array.isArray(examResults) && examResults.length > 0
                    ? (
                        <>
                            {currentView === 'table' && renderTableSection()}
                            {currentView === 'chart' && renderChartSection()}

                            <Paper className="view-switcher" elevation={3}>
                                <BottomNavigation value={currentView} onChange={handleViewChange} showLabels>
                                    <BottomNavigationAction
                                        label="Table"
                                        value="table"
                                        icon={currentView === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                    />
                                    <BottomNavigationAction
                                        label="Chart"
                                        value="chart"
                                        icon={currentView === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                    />
                                </BottomNavigation>
                            </Paper>
                        </>
                    )
                    : (
                        <Button variant="contained" className="add-marks-button" onClick={() => navigate("/Admin/students/student/marks/" + studentId)}>
                            Add Marks
                        </Button>
                    )}
            </div>
        );
    };

    const DetailsSection = () => {
        return (
            <div className="student-details-section">
                <div className="student-info">
                    <p>Name: {userDetails.name}</p>
                    <p>Roll Number: {userDetails.rollNum}</p>
                    <p>Class: {studentClass.sclassName}</p>
                    <p>School: {schoolInfo.schoolName}</p>
                </div>
                {attendanceRecords && Array.isArray(attendanceRecords) && attendanceRecords.length > 0 && (
                    <div className="attendance-pie-chart">
                        <CustomPieChart data={attendanceChartData} />
                    </div>
                )}
                <Button variant="contained" className="delete-button" onClick={handleDelete}>
                    Delete
                </Button>
            </div>
        );
    };

    return (
        <div className="student-view-container">
            {loading
                ? (
                    <div className="loading-indicator">Loading...</div>
                )
                : (
                    <div className="student-content">
                        <Box className="tab-container">
                            <TabContext value={activeTab}>
                                <Box className="tab-header">
                                    <TabList onChange={handleTabChange} className="tab-list">
                                        <Tab label="Details" value="1" />
                                        <Tab label="Attendance" value="2" />
                                        <Tab label="Marks" value="3" />
                                    </TabList>
                                </Box>
                                <Container className="tab-content-container">
                                    <TabPanel value="1">
                                        <DetailsSection />
                                    </TabPanel>
                                    <TabPanel value="2">
                                        <AttendanceSection />
                                    </TabPanel>
                                    <TabPanel value="3">
                                        <MarksSection />
                                    </TabPanel>
                                </Container>
                            </TabContext>
                        </Box>
                    </div>
                )}
            <Popup message={popupMessage} setShowPopup={setPopupVisible} showPopup={popupVisible} />
        </div>
    );
};

export default ViewStudent;

const styles = {
    attendanceButton: {
        marginLeft: "20px",
        backgroundColor: "#270843",
        "&:hover": {
            backgroundColor: "#3f1068",
        }
    },
    styledButton: {
        margin: "20px",
        backgroundColor: "#02250b",
        "&:hover": {
            backgroundColor: "#106312",
        }
    }
};