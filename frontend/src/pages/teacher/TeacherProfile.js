import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/TeacherProfile.css';

const TeacherProfile = () => {
  const { currentUser, response, error, loading } = useSelector((state) => state.user);

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <p className="error-text">Error loading profile data</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="profile-container">
        <p className="info-text">No profile data available</p>
      </div>
    );
  }

  return (
    <div className="profile-card">
      <div className="profile-content">
        <p><strong>Name:</strong> {currentUser?.name || 'N/A'}</p>
        <p><strong>Email:</strong> {currentUser?.email || 'N/A'}</p>
        <p><strong>Class:</strong> {currentUser?.teachSclass?.sclassName || 'N/A'}</p>
        <p><strong>Subject:</strong> {currentUser?.teachSubject?.subName || 'N/A'}</p>
        <p><strong>School:</strong> {currentUser?.school?.schoolName || 'N/A'}</p>
      </div>
    </div>
  );
};

export default TeacherProfile;
