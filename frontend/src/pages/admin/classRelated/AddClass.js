import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addStuff } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import Popup from "../../../components/Popup";
import Classroom from "../../../assets/classroom.png";
import "../../styles/AddClass.css";

const AddClass = () => {
    const [sclassName, setSclassName] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userState = useSelector((state) => state.user);
    const { status, currentUser, response, error, tempDetails } = userState;

    const adminID = currentUser._id;
    const address = "Sclass";

    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const fields = {
        sclassName,
        adminID,
    };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        dispatch(addStuff(fields, address));
    };

    useEffect(() => {
        if (status === "added" && tempDetails) {
            navigate("/Admin/classes/class/" + tempDetails._id);
            dispatch(underControl());
            setLoader(false);
        } else if (status === "failed") {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === "error") {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, error, response, dispatch, tempDetails]);

    return (
        <>
            <div className="container">
                <div className="box">
                    <div className="image-container">
                        <img src={Classroom} alt="classroom" className="class-image" />
                    </div>
                    <form onSubmit={submitHandler}>
                        <h2 style={{marginBottom: '30px', color: '#333', textAlign: 'center'}}>Create New Class</h2>
                        <div className="form-group">
                            <label>Class Name</label>
                            <input
                                type="text"
                                value={sclassName}
                                onChange={(event) => setSclassName(event.target.value)}
                                required
                                className="input-field"
                                placeholder="Enter class name"
                            />
                        </div>
                        <button type="submit" className="submit-btn" disabled={loader}>
                            {loader ? "Creating..." : "Create Class"}
                        </button>
                        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
                            Go Back
                        </button>
                    </form>
                </div>
            </div>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default AddClass;