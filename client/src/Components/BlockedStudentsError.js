import React from "react";
import BlockedImg from "./Images/blocked.png";
import { useNavigate } from "react-router-dom";

const BlockedStudentsError = () => {
    const navigate = useNavigate();
    const handleback = () => {
        navigate("/login");
    };

    return (
        <div className="blockedpage">
            <img src={BlockedImg} alt="Blocked" className="blockedimg" />
            <h1>You Have Been Blocked!</h1>
            <h5>Kindly contact your admin</h5>
            <button className="backbtn" onClick={() => handleback()}>
                Go Back
            </button>
        </div>
    );
};

export default BlockedStudentsError;
