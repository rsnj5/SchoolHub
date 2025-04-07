import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';

import Popup from '../../../components/Popup';
import { BlueButton } from '../../../components/buttonStyles';
import {
    Box, InputLabel,
    MenuItem, Select,
    Typography, Stack,
    TextField, CircularProgress, FormControl
} from '@mui/material';

const StudentExamMarks = ({ situation }) => {
    const dispatch = useDispatch();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);
    const { response, error, statestatus } = useSelector((state) => state.student);
    const params = useParams()

    const [studentIdState, setStudentIdState] = useState("");
    const [subjectNameState, setSubjectNameState] = useState("");
    const [selectedSubjectId, setSelectedSubjectId] = useState("");
    const [marksState, setMarksState] = useState("");

    const [popupShow, setPopupShow] = useState(false);
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

    const handleChange = (event) => {
        const chosenSubject = subjectsList.find(
            (subjectItem) => subjectItem.subName === event.target.value
        );
        setSubjectNameState(chosenSubject.subName);
        setSelectedSubjectId(chosenSubject._id);
    }

    const studentFields = { subName: selectedSubjectId, marksObtained: marksState }

    const handleSubmit = (event) => {
        event.preventDefault()
        setIsLoading(true)
        dispatch(updateStudentFields(studentIdState, studentFields, "UpdateExamResult"))
    }

    useEffect(() => {
        if (response) {
            setIsLoading(false)
            setPopupShow(true)
            setPopupMessage(response)
        }
        else if (error) {
            setIsLoading(false)
            setPopupShow(true)
            setPopupMessage("error")
        }
        else if (statestatus === "added") {
            setIsLoading(false)
            setPopupShow(true)
            setPopupMessage("Done Successfully")
        }
    }, [response, statestatus, error])

    return (
        <div className='container'>
            {loading
                ?
                <div className='loader-container'>
                    <div>Loading...</div>
                </div>
                :
                <div className='content-wrapper'>
                    <Box
                        className='form-container'
                        sx={{
                            flex: '1 1 auto',
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <Box
                            className='form-box'
                            sx={{
                                maxWidth: 550,
                                px: 3,
                                py: '100px',
                                width: '100%'
                            }}
                        >
                            <div className='header-section'>
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
                            <form onSubmit={handleSubmit}>
                                <div className='form-fields'>
                                    <Stack spacing={3}>
                                        {
                                            situation === "Student" &&
                                            <FormControl fullWidth>
                                                <InputLabel id="subject-select-label">
                                                    Select Subject
                                                </InputLabel>
                                                <Select
                                                    labelId="subject-select-label"
                                                    id="subject-select"
                                                    value={subjectNameState}
                                                    label="Choose an option"
                                                    onChange={handleChange} required
                                                >
                                                    {subjectsList ?
                                                        subjectsList.map((subjectItem, index) => (
                                                            <MenuItem key={index} value={subjectItem.subName}>
                                                                {subjectItem.subName}
                                                            </MenuItem>
                                                        ))
                                                        :
                                                        <MenuItem value="Select Subject">
                                                            Add Subjects For Marks
                                                        </MenuItem>
                                                    }
                                                </Select>
                                            </FormControl>
                                        }
                                        <FormControl>
                                            <TextField type="number" label='Enter marks'
                                                value={marksState} required
                                                onChange={(e) => setMarksState(e.target.value)}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </FormControl>
                                    </Stack>
                                </div>
                                <div className='submit-button'>
                                    <BlueButton
                                        fullWidth
                                        size="large"
                                        sx={{ mt: 3 }}
                                        variant="contained"
                                        type="submit"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                                    </BlueButton>
                                </div>
                            </form>
                        </Box>
                    </Box>
                    <Popup message={popupMessage} setShowPopup={setPopupShow} showPopup={popupShow} />
                </div>
            }
        </div>
    )
}

export default StudentExamMarks