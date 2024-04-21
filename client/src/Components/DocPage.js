import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import html2pdf from "html2pdf.js";

const DocPage = () => {
    const { examId } = useParams();

    const [resultData, setResultData] = useState([]);

    const downloadPDF = () => {
        const element = document.getElementById("pdf-content"); // The ID of the element containing your content

        // Configuration options for pdf generation
        const options = {
            margin: 1,
            filename: "download.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };

        html2pdf().from(element).set(options).save();
    };

    const handlePrint = () => {
        window.print();
    };

    const getstudentresultData = async () => {
        try {
            let token = localStorage.getItem("usersdatatoken");
            const response = await fetch(
                "http://localhost:5000/getexamresultsone",
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
                throw new Error("Failed to fetch exam result details");
            }

            const examResultDetails = await response.json();
            setResultData(examResultDetails);
        } catch (error) {
            console.error("Error fetching exam result details:", error);
            throw error; // Rethrow the error to be caught by the caller
        }
    };

    useEffect(() => {
        getstudentresultData();
    }, []);

    return (
        <div className="finalresultdata" id="pdf-content">
            <h1>XYZ University</h1>
            <div className="printanddow">
                <button
                    className="printdownbtn"
                    onClick={() => {
                        handlePrint();
                    }}
                >
                    Print
                </button>
                <button
                    className="printdownbtn10"
                    onClick={() => {
                        downloadPDF();
                    }}
                >
                    Download
                </button>
            </div>
            <div className="table-container">
                <table className="my-table">
                    <tbody>
                        <tr>
                            <td className="left-column">
                                <p>
                                    Student Name:{" "}
                                    {resultData.user &&
                                        resultData.user.name &&
                                        resultData.user.name}
                                </p>
                                <p>
                                    Enrollment Number:{" "}
                                    {resultData.user &&
                                        resultData.user.enrollmentNumber}
                                </p>
                                <p>
                                    Department:{" "}
                                    {resultData.user &&
                                        resultData.user.department}
                                </p>
                                <p>
                                    Division:{" "}
                                    {resultData.user &&
                                        resultData.user.division}
                                </p>
                                <p>
                                    Semester:{" "}
                                    {resultData.user &&
                                        resultData.user.semester}
                                </p>
                            </td>
                            <td className="right-column">
                                <p>
                                    Subject:{" "}
                                    {resultData.examDetails &&
                                        resultData.examDetails.subject}
                                </p>
                                <p>
                                    Starting Time:{" "}
                                    {resultData.examDetails &&
                                        new Date(
                                            resultData.examDetails.startTime
                                        ).toLocaleString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        })}
                                </p>
                                <p>
                                    Ending Time:{" "}
                                    {resultData.examDetails &&
                                        new Date(
                                            resultData.examDetails.endTime
                                        ).toLocaleString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        })}
                                </p>
                                <p>
                                    Total Marks:{" "}
                                    {resultData.examDetails &&
                                        resultData.examDetails.passingMarks}
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="result-table-container">
                <table className="result-table">
                    <tbody>
                        <tr>
                            <td>Exam ID</td>
                            <td>{resultData.examId}</td>
                        </tr>
                        <tr>
                            <td>Total Questions</td>
                            <td>{resultData.totalQuestions}</td>
                        </tr>
                        <tr>
                            <td>Total Marks</td>
                            <td>{resultData.totalMarks}</td>
                        </tr>
                        <tr>
                            <td>Correct Answers</td>
                            <td>{resultData.correctAnswers}</td>
                        </tr>
                        <tr>
                            <td>None Answers</td>
                            <td>{resultData.noneAnswers}</td>
                        </tr>
                        <tr>
                            <td>Percentage</td>
                            <td>{resultData.percentage}</td>
                        </tr>
                        <tr>
                            <td>Grade</td>
                            <td>{resultData.grade}</td>
                        </tr>
                        <tr>
                            <td>Exam Duration</td>
                            <td>{resultData.examDuration}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DocPage;
