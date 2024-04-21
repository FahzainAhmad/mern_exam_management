import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FacContext, LoginContext } from "./ContextProvider/Context";
import SideBar from "../Components/FacultySideBar";
import FacultyHeader from "./FacultyHeader";

const FacultyDashboard = () => {
    const { faclogindata, setFacLoginData } = useContext(FacContext);
    const [list, setList] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newExam, setNewExam] = useState({
        facultyId: "",
        division: "",
        semester: "",
        department: "",
        subject: "",
        startTime: "",
        endTime: "",
        questionsFile: "",
        passingMarks: "",
    });
    const navigate = useNavigate();

    const logoutuser = async () => {
        let token = localStorage.getItem("facdatatoken");

        const res = await fetch("http://localhost:5000/logoutfac", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
                Accept: "application/json",
            },
            credentials: "include",
        });

        const data = await res.json();
        console.log(data);

        if (data.status == 201) {
            console.log("use logout");
            localStorage.removeItem("facdatatoken");
            setFacLoginData(false);
            navigate("/facultylogin");
        } else {
            console.log("error");
        }
    };

    // const goDash = () => {
    //     navigate("/dash")
    // }

    const goLogin = () => {
        navigate("/facultylogin");
    };
    const goRegister = () => {
        navigate("/facultyreg");
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
            console.log("Here : " + data);

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

    const handleAddExam = () => {
        setIsAddModalOpen(true);
    };

    const handleCancelAddExam = () => {
        setIsAddModalOpen(false);
    };

    const handleAddExamFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("facultyId", faclogindata.validUserOne.employeeNumber);
        formData.append("division", newExam.division);
        formData.append("semester", newExam.semester);
        formData.append("department", newExam.department);
        formData.append("subject", newExam.subject);
        formData.append("startTime", newExam.startTime);
        formData.append("endTime", newExam.endTime);
        formData.append("questionsFile", newExam.questionsFile);
        formData.append("passingMarks", newExam.passingMarks);

        fetch("http://localhost:5000/addexam", {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
        console.log(newExam);
        setIsAddModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        const newValue = name === "questionsFile" ? files[0] : value;
        setNewExam((prevState) => ({
            ...prevState,
            [name]: newValue,
        }));
    };

    const handleDeleteExam = async (examId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/deleteexam/${examId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete exam");
            }

            console.log("Exam deleted successfully");
            window.location.reload();
        } catch (error) {
            console.error("Error deleting exam:", error.message);
        }
    };

    useEffect(() => {
        DashboardValid();
        getexamsData();
    }, []);
    return (
        <div className="mainfac">
            <div className="faccon">
                <SideBar />
                <div className="othercon"></div>
            </div>
        </div>
    );
};

export default FacultyDashboard;
