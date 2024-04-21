import React, { useEffect, useState, useContext } from "react";
import { FacContext, LoginContext } from "./ContextProvider/Context";
import SideBar from "../Components/FacultySideBar";
import FacultyHeader from "./FacultyHeader";

const FacultyResources = () => {
    const { faclogindata, setFacLoginData } = useContext(FacContext);
    const [list, setList] = useState([]);

    const getexamsData = async () => {
        const token = localStorage.getItem("facdatatoken");

        const res = await fetch("http://localhost:5000/getexamsdata", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });

        const data = await res.json();
        if (res.status === 422 || !data) {
            console.log("error");
        } else {
            setList(data);
        }
    };

    const handleUploadDoc = async (examId) => {
        console.log("Yess");
        const token = localStorage.getItem("facdatatoken");

        // Get the file input element based on the exam ID
        const fileInput = document.getElementById(`fileInput_${examId}`);
        const selectedFiles = fileInput.files; // Get all selected files

        if (selectedFiles.length === 0) {
            // No files selected, handle accordingly
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append("resources", selectedFiles[i]); // Append each selected file to the FormData object with the same key 'resources'
        }
        formData.append("examId", examId); // Include examId for associating the files with the exam

        try {
            const response = await fetch("http://localhost:5000/uploadres", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: token,
                },
            });

            if (response.ok) {
                console.log("Files uploaded successfully");
            } else {
                console.error("File upload failed");
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

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

    useEffect(() => {
        DashboardValid();
        getexamsData();
    }, []);

    return (
        <div className="mainfac">
            <FacultyHeader />
            <div className="faccon">
                <SideBar />
                <div className="othercon">
                    <div className="overtable">
                        <table className="dark-table">
                            <thead>
                                <tr>
                                    <th>Exam Subject</th>
                                    <th>Semester</th>
                                    <th>Division</th>
                                    <th>Department</th>
                                    <th>Passing Marks</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Operation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map((exam) => (
                                    <tr key={exam._id}>
                                        <td>{exam.subject}</td>
                                        <td>{exam.semester}</td>
                                        <td>{exam.division}</td>
                                        <td>{exam.department}</td>
                                        <td>{exam.passingMarks}</td>
                                        <td>
                                            {new Date(
                                                exam.startTime
                                            ).toLocaleString()}
                                        </td>
                                        <td>
                                            {new Date(
                                                exam.endTime
                                            ).toLocaleString()}
                                        </td>
                                        <td>
                                            <input
                                                type="file"
                                                id={`fileInput_${exam._id}`}
                                            />
                                            <button
                                                className="emailbtn"
                                                onClick={() => {
                                                    handleUploadDoc(exam._id);
                                                }}
                                            >
                                                Add Resource
                                            </button>
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

export default FacultyResources;
