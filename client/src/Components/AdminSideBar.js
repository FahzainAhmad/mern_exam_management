import React from "react";
import { useNavigate } from "react-router-dom";

const AdminSideBar = () => {
    const navigate = useNavigate();
    const goToManageFaculty = () => {
        navigate("/admindash");
    };

    const goToBlockedStudents = () => {
        navigate("/bsadmin");
    };

    const goToManageRes = () => {
        navigate("/dashres");
    };

    const goToManageStudent = () => {
        navigate("/managestudent");
    };

    const goToLoginHistory = () => {
        navigate("/AdminLH");
    };

    const goToResources = () => {
        navigate("/resources");
    };

    return (
        <div className="facside">
            <div
                className="sideopt"
                onClick={() => {
                    goToManageFaculty();
                }}
            >
                Manage Faculty
            </div>
            <div
                className="sideopt"
                onClick={() => {
                    goToManageStudent();
                }}
            >
                Manage Student
            </div>
            {/* <div
                className="sideopt"
                onClick={() => {
                    goToManageStudent();
                }}
            >
                Manage Exam
            </div>
            <div
                className="sideopt"
                onClick={() => {
                    goToManageRes();
                }}
            >
                Manage Results
            </div> */}
            <div
                className="sideopt"
                onClick={() => {
                    goToBlockedStudents();
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

export default AdminSideBar;
