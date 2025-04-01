import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getClassStudents, getSubjectDetails } from '../../redux/sclassRelated/sclassHandle';
import CountUp from 'react-countup';
import SeeNotice from '../../components/SeeNotice';
import StudentsIcon from "../../assets/img1.png";
import LessonsIcon from "../../assets/subjects.svg";
import TestsIcon from "../../assets/assignment.svg";
import TimeIcon from "../../assets/time.svg";
import '../styles/TeacherHomePage.css';

const TeacherHomePage = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { subjectDetails, sclassStudents } = useSelector((state) => state.sclass);

    const classID = currentUser.teachSclass?._id;
    const subjectID = currentUser.teachSubject?._id;

    useEffect(() => {
        dispatch(getSubjectDetails(subjectID, "Subject"));
        dispatch(getClassStudents(classID));
    }, [dispatch, subjectID, classID]);

    const totalStudents = sclassStudents?.length || 0;
    const totalLessons = subjectDetails?.sessions || 0;

    return (
        <div className="teacher-home-container">
            <div className="dashboard">
                <div className="info-card">
                    <img src={StudentsIcon} alt="Students" />
                    <p>Class Students</p>
                    <span><CountUp start={0} end={totalStudents} duration={2.5} /></span>
                </div>
                <div className="info-card">
                    <img src={LessonsIcon} alt="Lessons" />
                    <p>Total Lessons</p>
                    <span><CountUp start={0} end={totalLessons} duration={5} /></span>
                </div>
                <div className="info-card">
                    <img src={TestsIcon} alt="Tests" />
                    <p>Tests Taken</p>
                    <span><CountUp start={0} end={24} duration={4} /></span>
                </div>
                <div className="info-card">
                    <img src={TimeIcon} alt="Time" />
                    <p>Total Hours</p>
                    <span><CountUp start={0} end={30} duration={4} suffix=" hrs" /></span>
                </div>
            </div>
            <div className="notice-board">
                <SeeNotice />
            </div>
        </div>
    );
};

export default TeacherHomePage;
