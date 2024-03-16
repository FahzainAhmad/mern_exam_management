import React from "react";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
    const navigate = useNavigate();

    const logout = () => {
        navigate("/facultylogin");
    };
    return (
        <div>
            <div className="headerclass">
                <button
                    className="headerbtn"
                    onClick={() => {
                        logout();
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AdminHeader;
