import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, updateUser } from '../../redux/userRelated/userHandle';
import { useNavigate } from 'react-router-dom';
import { authLogout } from '../../redux/userRelated/userSlice';
import '../styles/AdminProfile.css';

const AdminProfile = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [showEdit, setShowEdit] = useState(false);
    const [name, setName] = useState(currentUser?.name || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [password, setPassword] = useState('');
    const [schoolName, setSchoolName] = useState(currentUser?.schoolName || '');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleUpdate = (event) => {
        event.preventDefault();
        const updatedFields = password ? { name, email, password, schoolName } : { name, email, schoolName };
        dispatch(updateUser(updatedFields, currentUser._id, 'Admin'));
    };

    const handleDelete = () => {
        dispatch(deleteUser(currentUser._id, 'Students'));
        dispatch(deleteUser(currentUser._id, 'Admin'));
        dispatch(authLogout());
        navigate('/');
    };

    return (
        <div className="admin-container">
            <h2>Admin Profile</h2>
            <p><strong>Name:</strong> {currentUser?.name}</p>
            <p><strong>Email:</strong> {currentUser?.email}</p>
            <p><strong>School:</strong> {currentUser?.schoolName}</p>

            <button className="toggle-btn" onClick={() => setShowEdit(!showEdit)}>
                {showEdit ? "Cancel" : "Edit Profile"}
            </button>

            {showEdit && (
                <form className="edit-form" onSubmit={handleUpdate}>
                    <label>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

                    <label>School</label>
                    <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} required />

                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                    <button type="submit" className="update-btn">Update</button>
                </form>
            )}

            <button className="delete-btn" onClick={handleDelete}>Delete Account</button>
        </div>
    );
};

export default AdminProfile;
