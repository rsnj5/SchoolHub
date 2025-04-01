import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Popup from '../../../components/Popup';
import { registerUser } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { CircularProgress } from '@mui/material';
import { getAllSclasses, getSubjectList } from '../../../redux/sclassRelated/sclassHandle';

const AddTeacher = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, response, error, currentUser } = useSelector(state => state.user);
  const { 
    sclassesList, 
    subjectsList,
    loading: classLoading,
    error: classError
  } = useSelector(state => state.sclass);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(currentUser?.school?._id || '');
  const [selectedSclass, setSelectedSclass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  // Fetch classes when component mounts
  useEffect(() => {
    if (currentUser?.school?._id) {
      dispatch(getAllSclasses(currentUser.school._id, "Sclass"));
      dispatch(getSubjectList(currentUser.school._id, "Subject"));
    }
  }, [dispatch, currentUser]);

  const role = "Teacher";
  
  const submitHandler = (event) => {
    event.preventDefault();
    
  

    const fields = { 
      name, 
      email, 
      password, 
      role, 
      
      teachSubject: selectedSubject || undefined,
      teachSclass: selectedSclass 
    };

    setLoader(true);
    dispatch(registerUser(fields, role));
  };

  useEffect(() => {
    if (status === 'added') {
      dispatch(underControl());
      navigate("/Admin/teachers");
    }
    else if (status === 'failed') {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    }
    else if (status === 'error') {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch]);

  if (classLoading) {
    return <div>Loading classes and subjects...</div>;
  }

  if (classError) {
    return <div>Error loading classes: {classError.message}</div>;
  }

  return (
    <div>
      <div className="register">
        <form className="registerForm" onSubmit={submitHandler}>
          <span className="registerTitle">Add Teacher</span>
           
          
          
          <label>Class *</label>
          <select 
            className="registerInput"
            value={selectedSclass}
            onChange={(e) => {
              setSelectedSclass(e.target.value);
              setSelectedSubject('');
            }}
            required
            disabled={!sclassesList || sclassesList.length === 0}
          >
            <option value="">Select Class</option>
            {sclassesList?.map((sclass) => (
              <option key={sclass._id} value={sclass._id}>
                {sclass.sclassName}
              </option>
            ))}
          </select>
          
          <label>Subject</label>
          <select 
            className="registerInput"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedSclass || !subjectsList || subjectsList.length === 0}
          >
            <option value="">Select Subject (Optional)</option>
            {subjectsList
              ?.filter(subject => subject.sclassName === selectedSclass)
              .map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.subName}
                </option>
              ))}
          </select>

          <label>Name *</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter teacher's name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />

          <label>Email *</label>
          <input 
            className="registerInput" 
            type="email" 
            placeholder="Enter teacher's email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />

          <label>Password *</label>
          <input 
            className="registerInput" 
            type="password" 
            placeholder="Enter teacher's password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />

          <button className="registerButton" type="submit" disabled={loader || !selectedSclass}>
            {loader ? <CircularProgress size={24} color="inherit" /> : 'Register'}
          </button>
        </form>
      </div>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </div>
  );
};

export default AddTeacher;