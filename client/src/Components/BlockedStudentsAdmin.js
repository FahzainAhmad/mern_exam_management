import React, { useEffect, useState, useContext } from "react";
import { FacContext, LoginContext } from "./ContextProvider/Context";
import SideBar from "../Components/FacultySideBar";
import FacultyHeader from "./FacultyHeader";
import AdminSideBar from "./AdminSideBar";
import AdminHeader from "./AdminHeader";

const BlockedStudentsAdmin = () => {
    const [studentData, setStudentData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const handleBlock = async (studentId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/blockstudent/${studentId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ isBlocked: 1 }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to block student");
            } else {
                window.location.reload();
            }
        } catch (error) {
            console.error("Error blocking student:", error);
        }
    };

    const handleUnblock = async (studentId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/blockunstudent/${studentId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ isBlocked: 0 }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to block student");
            } else {
                window.location.reload();
            }
        } catch (error) {
            console.error("Error blocking student:", error);
        }
    };

    const fetchStudentData = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/blockedstudentlist",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch students data");
            }

            const studentData = await response.json();
            setStudentData(studentData.data);
            console.log(studentData);
        } catch (error) {
            console.error("Error fetching exam results:", error);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/bsstudent/${searchQuery}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch student data");
            }

            const studentData = await response.json();
            setStudentData([studentData]);
        } catch (error) {
            console.error("Error fetching student data:", error);
        }
    };

    const handleReset = () => {
        window.location.reload();
    };

    useEffect(() => {
        fetchStudentData();
    }, []);

    return (
        <div className="mainfac">
            <AdminHeader />
            <div className="faccon">
                <AdminSideBar />
                <div className="othercon">
                    <div className="searchcon">
                        <input
                            type="text"
                            id="bssearchbar"
                            placeholder="Search Here!"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button onClick={handleSearch}>Search</button>
                        <button onClick={handleReset}>Reset</button>
                    </div>
                    <div className="othercon stdextra">
                        {studentData.map((student) => (
                            <div key={student._id} className="divres">
                                <p className="examName">
                                    {student.enrollmentNumber}
                                </p>
                                <p className="examName">{student.name}</p>
                                <p className="examtiming">
                                    Roll Number : {student.rollNumber}
                                </p>
                                <p className="examtiming">
                                    Semester {student.semester},{" "}
                                    {student.division}, {student.department}
                                </p>
                                {student.IsBlocked === 0 ? (
                                    <button
                                        className="viewexamd blocked"
                                        onClick={() => handleBlock(student._id)}
                                    >
                                        Block
                                    </button>
                                ) : (
                                    <button
                                        className="viewexamd unblocked"
                                        onClick={() =>
                                            handleUnblock(student._id)
                                        }
                                    >
                                        Unblock
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlockedStudentsAdmin;
