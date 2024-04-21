import React from "react";
import { useNavigate } from "react-router-dom";

const FacultySideBar = () => {
    const navigate = useNavigate();
    const goToManageExams = () => {
        navigate("/dashfac");
    };

    const goToManageRes = () => {
        navigate("/dashres");
    };

    const goToResources = () => {
        navigate("/facresources");
    };

    const goToLoginHistory = () => {
        navigate("/facloginhistory");
    };

    const goToBlockStds = () => {
        navigate("/blockstudents");
    };

    return (
        <div className="facside">
            <div
                className="sideopt"
                onClick={() => {
                    goToManageExams();
                }}
            >
                Manage Exams
            </div>
            <div
                className="sideopt"
                onClick={() => {
                    goToManageRes();
                }}
            >
                Manage Results
            </div>
            <div
                className="sideopt"
                onClick={() => {
                    goToResources();
                }}
            >
                Manage Resources
            </div>
            <div
                className="sideopt"
                onClick={() => {
                    goToBlockStds();
                }}
            >
                Blocked Students
            </div>
            <div
                className="sideopt"
                onClick={() => {
                    goToLoginHistory();
                }}
            >
                Login History
            </div>
        </div>
    );
};

export default FacultySideBar;
