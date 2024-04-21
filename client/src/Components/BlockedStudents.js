import React, { useEffect, useState, useContext } from "react";
import { FacContext, LoginContext } from "./ContextProvider/Context";
import SideBar from "../Components/FacultySideBar";
import FacultyHeader from "./FacultyHeader";

const BlockedStudents = () => {
    const { faclogindata, setFacLoginData } = useContext(FacContext);
    const [studentData, setStudentData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const DashboardValid = async () => {
        let token = localStorage.getItem("facdatatoken");
        console.log(token);
        if (token) {
            const res = await fetch("http://localhost:5000/validfac", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            });

            const data = await res.json();

            if (data.status === 401 || !data) {
                console.log("issue");
            } else {
                console.log("user verify");
                setFacLoginData(data);
            }
        } else {
            console.log("user not verify");
        }
    };

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
        DashboardValid();
        fetchStudentData();
    }, []);

    return (
        <div className="mainfac">
            <FacultyHeader />
            <div className="faccon">
                <SideBar />
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

export default BlockedStudents;
