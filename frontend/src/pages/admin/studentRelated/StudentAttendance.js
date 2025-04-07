import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';

import {
    Box, InputLabel,
    MenuItem, Select,
    Typography, Stack,
    TextField, CircularProgress, FormControl
} from '@mui/material';
import { PurpleButton } from '../../../components/buttonStyles';
import Popup from '../../../components/Popup';

const StudentAttendance = ({ situation }) => {
    const dispatch = useDispatch();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);
    const { response, error, statestatus } = useSelector((state) => state.student);
    const params = useParams()

    const [studentIdState, setStudentIdState] = useState("");
    const [subjectNameState, setSubjectNameState] = useState("");
    const [selectedSubjectId, setSelectedSubjectId] = useState("");
    const [attendanceStatus, setAttendanceStatus] = useState('');
    const [attendanceDate, setAttendanceDate] = useState('');

    const [showPopupState, setShowPopupState] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (situation === "Student") {
            setStudentIdState(params.id);
            const studentIdParam = params.id
            dispatch(getUserDetails(studentIdParam, "Student"));
        }
        else if (situation === "Subject") {
            const { studentID, subjectID } = params
            setStudentIdState(studentID);
            dispatch(getUserDetails(studentID, "Student"));
            setSelectedSubjectId(subjectID);
        }
    }, [situation]);

    useEffect(() => {
        if (userDetails && userDetails.sclassName && situation === "Student") {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails]);

    const handleSubjectChange = (event) => {
        const selectedSubject = subjectsList.find(
            (subjectItem) => subjectItem.subName === event.target.value
        );
        setSubjectNameState(selectedSubject.subName);
        setSelectedSubjectId(selectedSubject._id);
    }

    const attendanceFields = { 
        subName: selectedSubjectId, 
        status: attendanceStatus, 
        date: attendanceDate 
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setIsLoading(true)
        dispatch(updateStudentFields(studentIdState, attendanceFields, "StudentAttendance"))
    }

    useEffect(() => {
        if (response) {
            setIsLoading(false)
            setShowPopupState(true)
            setPopupMessage(response)
        }
        else if (error) {
            setIsLoading(false)
            setShowPopupState(true)
            setPopupMessage("error")
        }
        else if (statestatus === "added") {
            setIsLoading(false)
            setShowPopupState(true)
            setPopupMessage("Done Successfully")
        }
    }, [response, statestatus, error])

    return (
        <div className="attendance-container">
            {loading
                ?
                <div className="loading-container">
                    <div>Loading...</div>
                </div>
                :
                <div className="attendance-content">
                    <Box
                        className="attendance-form-wrapper"
                        sx={{
                            flex: '1 1 auto',
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <Box
                            className="attendance-form-box"
                            sx={{
                                maxWidth: 550,
                                px: 3,
                                py: '100px',
                                width: '100%'
                            }}
                        >
                            <div className="attendance-header">
                                <Stack spacing={1} sx={{ mb: 3 }}>
                                    <Typography variant="h4">
                                        Student Name: {userDetails.name}
                                    </Typography>
                                    {currentUser.teachSubject &&
                                        <Typography variant="h4">
                                            Subject Name: {currentUser.teachSubject?.subName}
                                        </Typography>
                                    }
                                </Stack>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="attendance-form">
                                <div className="form-fields-section">
                                    <Stack spacing={3}>
                                        {
                                            situation === "Student" &&
                                            <FormControl fullWidth className="subject-select">
                                                <InputLabel id="subject-select-label">Select Subject</InputLabel>
                                                <Select
                                                    labelId="subject-select-label"
                                                    id="subject-select"
                                                    value={subjectNameState}
                                                    label="Choose an option"
                                                    onChange={handleSubjectChange} 
                                                    required
                                                >
                                                    {subjectsList ?
                                                        subjectsList.map((subjectItem, index) => (
                                                            <MenuItem key={index} value={subjectItem.subName}>
                                                                {subjectItem.subName}
                                                            </MenuItem>
                                                        ))
                                                        :
                                                        <MenuItem value="Select Subject">
                                                            Add Subjects For Attendance
                                                        </MenuItem>
                                                    }
                                                </Select>
                                            </FormControl>
                                        }
                                        <FormControl fullWidth className="status-select">
                                            <InputLabel id="status-select-label">Attendance Status</InputLabel>
                                            <Select
                                                labelId="status-select-label"
                                                id="status-select"
                                                value={attendanceStatus}
                                                label="Choose an option"
                                                onChange={(event) => setAttendanceStatus(event.target.value)}
                                                required
                                            >
                                                <MenuItem value="Present">Present</MenuItem>
                                                <MenuItem value="Absent">Absent</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormControl className="date-picker">
                                            <TextField
                                                label="Select Date"
                                                type="date"
                                                value={attendanceDate}
                                                onChange={(event) => setAttendanceDate(event.target.value)} 
                                                required
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </FormControl>
                                    </Stack>
                                </div>

                                <div className="submit-button-section">
                                    <PurpleButton
                                        fullWidth
                                        size="large"
                                        sx={{ mt: 3 }}
                                        variant="contained"
                                        type="submit"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                                    </PurpleButton>
                                </div>
                            </form>
                        </Box>
                    </Box>
                    <Popup 
                        message={popupMessage} 
                        setShowPopup={setShowPopupState} 
                        showPopup={showPopupState} 
                    />
                </div>
            }
        </div>
    )
}

export default StudentAttendance