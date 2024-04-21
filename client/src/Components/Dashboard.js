import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LoginContext } from "./ContextProvider/Context";
import StudentHeader from "./StudentHeader";
import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);

const Dashboard = () => {
    const { logindata, setLoginData } = useContext(LoginContext);
    const [list, setList] = useState([]);
    const [examsData, setExamsData] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [resultData, setResultData] = useState([]);
    const [resourcesData, setResourcesData] = useState([]);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const logoutuser = async () => {
        let token = localStorage.getItem("usersdatatoken");

        const res = await fetch("http://localhost:5000/logout", {
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
            localStorage.removeItem("usersdatatoken");
            setLoginData(false);
            navigate("/");
        } else {
            console.log("error");
        }
    };

    // const goDash = () => {
    //     navigate("/dash")
    // }

    const goLogin = () => {
        navigate("/login");
    };
    const goRegister = () => {
        navigate("/register");
    };

    const handleOpenModal = () => {
        setIsAddModalOpen(true);
    };

    const handleClosebtn = () => {
        setIsAddModalOpen(false);
    };

    const DashboardValid = async () => {
        let token = localStorage.getItem("usersdatatoken");
        console.log(token);
        if (token) {
            const res = await fetch("http://localhost:5000/validuser", {
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
                setLoginData(data);
            }
        } else {
            console.log("user not verify");
        }
    };

    const getstudentexamData = async () => {
        let token = localStorage.getItem("usersdatatoken");
        fetch("http://localhost:5000/getstudentexams", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch exam data");
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setExamsData(data);
            })
            .catch((error) => {
                console.error("Error fetching exam data:", error);
            });
    };
    const getresourceData = async () => {
        let token = localStorage.getItem("usersdatatoken");
        fetch("http://localhost:5000/getresourcedata", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        })
            .then((response) => response.json())
            .then((resources) => {
                console.log("r : " + JSON.stringify(resources));
                // Assuming resources is an array of objects with filename and examDetails properties
                setResourcesData(resources);
            })
            .catch((error) => {
                console.error("Error fetching exam data:", error);
            });
    };

    // Make the API call to fetch exam results
    const getstudentresultData = async () => {
        try {
            // Make the fetch call to get exam results
            let token = localStorage.getItem("usersdatatoken");
            const response = await fetch(
                "http://localhost:5000/getexamresults",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token, // Include the access token
                    },
                }
            );

            // Check if the response is successful
            if (!response.ok) {
                throw new Error("Failed to fetch exam results");
            }

            // Parse the JSON response
            const examResults = await response.json();

            // Log the exam results (including exam details)
            console.log(examResults);

            // Update the state with exam results
            setResultData(examResults);

            // Now you can access exam details for each examResult
            examResults.forEach((result) => {
                const examDetail = result.examDetails;
                console.log(examDetail); // Access exam details here
            });

            // Handle the exam results as needed
        } catch (error) {
            console.error("Error fetching exam results:", error);
        }
    };

    useEffect(() => {
        DashboardValid();
        getstudentexamData();
        getstudentresultData();
        getresourceData();
    }, []);

    const chartData = {
        labels: resultData.map((examResult) => examResult.examId), // Exam IDs
        datasets: [
            {
                label: "Correct Answers",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                data: resultData.map((examResult) => examResult.correctAnswers),
            },
            {
                label: "Unattended Questions",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
                data: resultData.map((examResult) => examResult.noneAnswers),
            },
        ],
    };

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    return (
        <div className="uppercon">
            {isAddModalOpen && (
                <div className="modal-container">
                    <div className="modal-content">
                        Hello
                        <button
                            onClick={() => {
                                handleClosebtn();
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            <StudentHeader />
            <div className="studentcon">
                <div className="examlistcon">
                    <h1>Exams</h1>
                    <div className="examcons">
                        {examsData.map((exam) => (
                            <div className="examcard" key={exam._id}>
                                <h2>{exam.subject}</h2>
                                <p className="classdetails">
                                    Semester {exam.semester} Division{" "}
                                    {exam.division}, {exam.department}
                                </p>

                                <p className="examstatus">{exam.examStatus}</p>
                                <p className="dtsyle">Start Time</p>
                                <p className="dtact">
                                    {new Date(exam.startTime).toLocaleString(
                                        "en-US",
                                        {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        }
                                    )}
                                </p>
                                <p className="dtsyle">End Time</p>
                                <p className="dtact">
                                    {new Date(exam.endTime).toLocaleString(
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
                                <p className="dtsyle">Total Marks</p>
                                <p className="dtact">{exam.passingMarks}</p>
                                {exam.examStatus === "Ongoing" && (
                                    <Link
                                        to={`/take-test/${exam._id}`}
                                        className="taketestbtn"
                                    >
                                        Take Test
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="examlistcon">
                    <h1>Results</h1>
                    <div className="examcons">
                        {resultData.map((examResult) => (
                            <div className="examcard" key={examResult._id}>
                                {isAddModalOpen && (
                                    <div className="modal-container">
                                        <div className="modal-content">
                                            <h4>Enter Recipient's email</h4>
                                            <input
                                                type="email"
                                                id="sharemail"
                                                required
                                                className="emailtfield"
                                                value={email}
                                                onChange={handleChange}
                                            />
                                            <div className="d-in">
                                                <Link
                                                    to={`mailto:${email}?subject=XYZ%20University%2C%20Result&body=
                                                    Correct%20Answers%3A%20${
                                                        examResult.correctAnswers
                                                    }%0A
                                                    Percentage%3A%20${
                                                        examResult.percentage
                                                    }%25%0A
                                                    Grade%3A%20${
                                                        examResult.grade
                                                    }%0A
                                                    ----------------------------------------------------%0A
                                                    Details%3A%0A
                                                    - Total%20Marks%20%3A%20${
                                                        examResult.totalMarks
                                                    }%0A
                                                    - Obtained%20Marks%20%3A%20${
                                                        (examResult.percentage /
                                                            100) *
                                                        examResult.totalMarks
                                                    }%0A
                                                    - Percentage%20%3A%20${
                                                        examResult.percentage
                                                    }%25%0A
                                                    - Correct%20Answers%20%3A%20${
                                                        examResult.correctAnswers
                                                    }%0A
                                                    - Unattended%20%3A%20${
                                                        examResult.noneAnswers
                                                    }`}
                                                    className="emailbtn"
                                                >
                                                    Share
                                                </Link>
                                                <button
                                                    className="emailbtn"
                                                    onClick={() => {
                                                        handleClosebtn();
                                                    }}
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="headres">
                                    <div className="subs">
                                        <h2>
                                            {examResult.examDetails.subject}
                                        </h2>
                                        <p className="classdetails">
                                            Semester{" "}
                                            {examResult.examDetails.semester}{" "}
                                            Division{" "}
                                            {examResult.examDetails.division},{" "}
                                            {examResult.examDetails.department}
                                        </p>
                                    </div>
                                    <p className="examgrade">
                                        {examResult.grade}
                                    </p>
                                </div>
                                <div className="chart-container">
                                    <Pie
                                        data={{
                                            labels: [
                                                "Correct",
                                                "Unattended",
                                                "Wrong",
                                            ],
                                            datasets: [
                                                {
                                                    label: "Answers",
                                                    backgroundColor: [
                                                        "rgba(75, 192, 192, 0.2)",
                                                        "rgba(255, 99, 132, 0.2)",
                                                        "rgba(255, 206, 86, 0.2)",
                                                    ],
                                                    borderColor: [
                                                        "rgba(75, 192, 192, 1)",
                                                        "rgba(255, 99, 132, 1)",
                                                        "rgba(255, 206, 86, 1)",
                                                    ],
                                                    borderWidth: 1,
                                                    data: [
                                                        examResult.correctAnswers,
                                                        examResult.noneAnswers,
                                                        examResult.totalQuestions -
                                                            examResult.correctAnswers -
                                                            examResult.noneAnswers,
                                                    ],
                                                },
                                            ],
                                        }}
                                    />
                                </div>
                                <p className="examstatus">
                                    Total Marks : {examResult.totalMarks}
                                </p>
                                <p className="examstatus">
                                    Obtained Marks:{" "}
                                    {(examResult.percentage / 100) *
                                        examResult.totalMarks}
                                </p>
                                <p className="examstatus">
                                    Percentage : {examResult.percentage} %
                                </p>
                                <p className="examstatus">
                                    Correct Answers :{" "}
                                    {examResult.correctAnswers}
                                </p>
                                <p className="examstatusbad">
                                    Unattended : {examResult.noneAnswers}
                                </p>
                                <div className="opcon">
                                    <button
                                        onClick={() => {
                                            handleOpenModal();
                                        }}
                                        className="taketestbtn"
                                    >
                                        Share
                                    </button>
                                    <Link
                                        to={`/DocView/${examResult._id}`}
                                        className="taketestbtn"
                                    >
                                        View Doc
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="examlistcon">
                    <h1>Resources</h1>
                    <table className="dark-table">
                        <thead>
                            <tr>
                                <th>Exam Subject</th>
                                <th>Semester</th>
                                <th>Division</th>
                                <th>Department</th>
                                <th>Resource Filename</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resourcesData.map((examDetails) => (
                                <tr key={examDetails.examId}>
                                    <td>{examDetails.examName}</td>
                                    <td>{examDetails.examDiv}</td>
                                    <td>{examDetails.examSem}</td>
                                    <td>{examDetails.examDep}</td>
                                    <td>
                                        {/* Assuming resources is an array of objects with filename property */}
                                        {examDetails.resources.map(
                                            (resource, index) => (
                                                <div key={index}>
                                                    <a
                                                        href={`http://localhost:5000/download/${resource.filename}`}
                                                        target="_blank" // Open link in a new tab
                                                        rel="noopener noreferrer" // Security best practice
                                                    >
                                                        {resource.filename}
                                                    </a>
                                                </div>
                                            )
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
