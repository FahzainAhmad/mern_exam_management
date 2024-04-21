import React, { useState, useEffect } from "react";
import SideBar from "../Components/FacultySideBar";
import FacultyHeader from "./FacultyHeader";

const FacultyManageRes = () => {
    const [isExamModalOpen, setIsExamModalOpen] = useState(false);
    const [isExamEditModalOpen, setIsExamEditModalOpen] = useState(false);
    const [examResults, setExamResults] = useState([]);
    const [editId, setEditId] = useState("");
    const [examData, setExamData] = useState([]);

    const fetchExamResults = async () => {
        try {
            const response = await fetch("http://localhost:5000/examdatafac", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    // Add any additional headers if needed
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch exam results");
            }

            const examData = await response.json();
            setExamData(examData);
            // Handle the exam results as needed
        } catch (error) {
            console.error("Error fetching exam results:", error);
        }
    };

    const handleShowExam = async (examId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/extractexamresults/${examId}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch exam results");
            }
            const data = await response.json();
            setExamResults(data);
        } catch (error) {
            console.error("Error fetching exam results:", error);
        }
        setIsExamModalOpen(true);
    };
    const handleCancelShowExam = () => {
        setIsExamModalOpen(false);
    };

    const handleShowEditExam = (examrId) => {
        setEditId(examrId);
        setIsExamEditModalOpen(true);
    };

    const handleCancelShowEditExam = () => {
        setIsExamEditModalOpen(false);
    };

    const handleEdit = async (event) => {
        const formData = new FormData(event.target);
        const newData = {
            percentage: formData.get("percentage"),
            grade: formData.get("grade"),
        };
        console.log("EID : " + editId);
        try {
            const response = await fetch(
                `http://localhost:5000/edit-exam/${editId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newData),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to edit exam");
            }

            // Handle success, such as updating the UI or showing a success message
        } catch (error) {
            console.error("Error editing exam:", error);
            // Handle error, such as displaying an error message to the user
        }
    };

    useEffect(() => {
        fetchExamResults();
    }, []);

    return (
        <div className="mainfac">
            {isExamEditModalOpen && (
                <div className="modal-container top">
                    <div className="modal-content">
                        <h2>Enter New Data</h2>
                        <form onSubmit={handleEdit}>
                            <input
                                type="text"
                                placeholder="percentage"
                                required
                                name="percentage"
                                className="editfield"
                            />
                            <input
                                type="text"
                                placeholder="grade"
                                required
                                name="grade"
                                className="editfield"
                            />
                            <div>
                                <button className="startexambtn" type="submit">
                                    Update
                                </button>
                                <button
                                    className="closebtn"
                                    onClick={() => {
                                        handleCancelShowEditExam();
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isExamModalOpen && (
                <div className="modal-container">
                    <div className="modal-content cuscon">
                        <div className="exam-results-container">
                            <table className="exam-results-table">
                                <thead>
                                    <tr>
                                        <th>Enrollment No</th>
                                        <th>Student Name</th>
                                        <th>Semester</th>
                                        <th>Division</th>
                                        <th>Department</th>
                                        <th>Percentage</th>
                                        <th>Grade</th>
                                        <th>Action</th>{" "}
                                        {/* Add this column for the edit operation */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {examResults.map(({ examResult, user }) => (
                                        <tr
                                            key={examResult._id}
                                            className="result-item"
                                        >
                                            <td>{user.enrollmentNumber}</td>
                                            <td>{user.name}</td>
                                            <td>{user.semester}</td>
                                            <td>{user.division}</td>
                                            <td>{user.department}</td>
                                            <td>{examResult.percentage}</td>
                                            <td>{examResult.grade}</td>
                                            <td>
                                                <button
                                                    onClick={() => {
                                                        handleShowEditExam(
                                                            examResult._id
                                                        );
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button
                            className="closebtn"
                            onClick={() => {
                                handleCancelShowExam();
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            <FacultyHeader />
            <div className="faccon">
                <SideBar />
                <div className="othercon resextra">
                    {examData.map((exam) => (
                        <div key={exam._id} className="divres">
                            <p className="examName">{exam.subject}</p>
                            <p className="examtiming">
                                {exam.startTime &&
                                    exam.startTime &&
                                    new Date(exam.startTime).toLocaleString(
                                        "en-US",
                                        {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        }
                                    )}
                            </p>
                            <p className="examtiming">
                                {exam.endTime &&
                                    exam.endTime &&
                                    new Date(exam.endTime).toLocaleString(
                                        "en-US",
                                        {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        }
                                    )}
                            </p>
                            <p className="examtiming">
                                Semester {exam.semester}, {exam.division},{" "}
                                {exam.department}
                            </p>
                            <button
                                className="viewexamd"
                                onClick={() => {
                                    handleShowExam(exam._id);
                                }}
                            >
                                View
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FacultyManageRes;
