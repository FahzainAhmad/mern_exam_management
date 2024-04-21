import React, { useState, useEffect } from "react";
import SideBar from "../Components/FacultySideBar";
import FacultyHeader from "./FacultyHeader";

const FacultyLH = () => {
    const [loginHistory, setLoginHistory] = useState([]);

    const getstudentlh = async () => {
        const res = await fetch("http://localhost:5000/login-history-student", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();
        if (res.status === 422 || !data) {
            console.log("error");
        } else {
            setLoginHistory(data.data);
        }
    };

    useEffect(() => {
        getstudentlh();
    }, []);

    return (
        <div className="mainfac">
            <FacultyHeader />
            <div className="faccon">
                <SideBar />
                <div className="othercon">
                    <div className="exam-results-container w-80">
                        <table className="exam-results-table">
                            <thead>
                                <tr>
                                    <th>Enrollment No.</th>
                                    <th>Position</th>
                                    <th>Login Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loginHistory.map((item, index) => (
                                    <tr key={index}>
                                        <td className="lhdata">
                                            {item.userName}
                                        </td>
                                        <td className="lhdata">
                                            {item.position}
                                        </td>
                                        <td className="lhdata">
                                            {new Date(
                                                item.loginTime
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyLH;
