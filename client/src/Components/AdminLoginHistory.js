import React, { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import { useNavigate } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";

const AdminLoginHistory = () => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/login-history-fac",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                const data = await response.json();
                setLoginData(data.data);
                console.log(loginData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="mainadmindiv">
            <AdminHeader />
            <div className="horcon">
                <AdminSideBar />
                <div className="datamaincon">
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
                                {loginData.map((item, index) => (
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

export default AdminLoginHistory;
