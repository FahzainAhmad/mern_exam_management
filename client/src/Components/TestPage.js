import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const TestPage = () => {
    const [basicData, setBasicData] = useState([]);
    const [timeRemaining, setTimeRemaining] = useState(
        calculateTimeRemaining()
    );
    const [questions, setQuestions] = useState([]);
    const { examId } = useParams();
    const navigate = useNavigate();
    let token = localStorage.getItem("usersdatatoken");
    const getstudentdata = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/get-test-data",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                    body: JSON.stringify({ examId }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to send examId to server");
            }

            const basicexamdata = await response.json();
            setBasicData(basicexamdata);
        } catch (error) {
            console.error("Error sending examId to server:", error.message);
            throw error;
        }
    };

    const getallques = async () => {
        try {
            const response = await fetch("http://localhost:5000/getquestions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ examId }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();

            console.log(data);
            const parsedData = JSON.parse(data);

            setQuestions(parsedData);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    function calculateTimeRemaining() {
        const currentTime = new Date().getTime();

        const endTime = basicData.examData && basicData.examData.endTime;
        const formattedEndTime =
            endTime && new Date(endTime).toLocaleString("en-US");

        const remainingTime =
            endTime && new Date(formattedEndTime).getTime() - currentTime;
        // Fix time
        console.log("hello");

        if (remainingTime <= 0) {
            console.log("hi");
            return { hours: 0, minutes: 0, seconds: 0 };
        }

        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor(
            (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        return { hours, minutes, seconds };
    }

    const formattedTime = `${timeRemaining.hours}h ${timeRemaining.minutes}m ${timeRemaining.seconds}s`;

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get current time when submit button is clicked
        const submitTime = new Date().getTime();

        // Collect form data including feedback
        const formData = questions.map((question, index) => {
            const selectedOption = document.querySelector(
                `input[name="Option${index}"]:checked`
            );
            const optionValue = selectedOption ? selectedOption.value : "None";
            return {
                question: question.Question,
                selectedOption: optionValue,
            };
        });
        const feedback = event.target.elements.feedback.value;
        console.log("fd : " + feedback);
        try {
            // Create query parameters including examId and submitTime
            const queryParams = new URLSearchParams({
                examId: examId,
                submitTime: submitTime,
                feedback: feedback,
            }).toString();

            // Construct endpoint
            const endpoint = `http://localhost:5000/checkexam?${queryParams}`;

            // Send POST request
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            console.log("Exam submitted successfully!");
            navigate("/dash");
        } catch (error) {
            console.error("Error submitting exam:", error);
        }
    };

    useEffect(() => {
        getstudentdata();
        const timerId = setInterval(() => {
            setTimeRemaining(calculateTimeRemaining());
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    return (
        <div className="testpagemain">
            <div className="examalldata">
                <div className="leftdetails">
                    <h1>Exam</h1>

                    <div className="generaldata">
                        <div>
                            Name:{" "}
                            {basicData.userData &&
                                basicData.userData.name &&
                                basicData.userData.name}
                        </div>
                        <div className="mt-2">
                            Exam Date :{" "}
                            {basicData.examData &&
                                basicData.examData.startTime &&
                                new Date(
                                    basicData.examData.startTime
                                ).toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    second: "2-digit",
                                })}
                        </div>
                        <p className="timeremaining">
                            Time Remaining : {formattedTime}
                        </p>
                    </div>
                </div>
                <div className="rightdetails">
                    <div>
                        <h1>
                            Subject :{" "}
                            {basicData.userData &&
                                basicData.examData.subject &&
                                basicData.examData.subject}
                        </h1>
                        <h2>
                            Enrollment ID :{" "}
                            {basicData.userData &&
                                basicData.userData.enrollmentNumber &&
                                basicData.userData.enrollmentNumber}
                        </h2>
                    </div>
                    <button
                        className="startexambtn"
                        onClick={() => {
                            getallques();
                        }}
                    >
                        Start Exam
                    </button>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="quescon">
                    {questions.map((question, index) => (
                        <div key={index} className="quesdiv">
                            <div className="ques">{question.Question}</div>
                            <div className="queoptscon">
                                {Object.keys(question)
                                    .filter((key) => key.startsWith("Option"))
                                    .map((optionKey) => (
                                        <span key={optionKey}>
                                            <input
                                                type="radio"
                                                name={`Option${index}`}
                                                value={question[optionKey]}
                                            />{" "}
                                            {question[optionKey]}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    ))}
                    <textarea
                        rows={8}
                        cols={40}
                        name="feedback"
                        className="feedbox"
                        placeholder="Feedback"
                    />
                </div>
                <button type="submit" className="submitexambtn">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default TestPage;
