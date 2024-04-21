import React, { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import { NavLink, useNavigate } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";

const ManageFaculty = () => {
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editedFaculty, setEditedFaculty] = useState({
        enrollmentNumber: "",
        name: "",
        rollNumber: "",
        department: "",
        semester: "",
        division: "",
        password: "",
        cpassword: "",
    });
    const [newStudent, setNewStudent] = useState({
        employeeNumber: "",
        name: "",
        department: "",
        designation: "",
        password: "",
    });

    const handleEditClick = (faculty) => {
        setIsEditModalOpen(true);
        setEditedFaculty(faculty);
    };

    const handleAddClick = (faculty) => {
        setIsAddModalOpen(true);
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newStudent),
            });

            if (response.ok) {
                console.log("Student added successfully");
                setIsAddModalOpen(false);
                // Optionally, update the facultyData state or refresh the faculty list
            } else {
                console.error("Error adding Student");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleEditSave = async (e) => {
        e.preventDefault();

        try {
            console.log("EMP : " + editedFaculty.employeeNumber);
            const response = await fetch(
                `http://localhost:5000/editEmployee/${editedFaculty.employeeNumber}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editedFaculty),
                }
            );

            if (response.ok) {
                console.log("Employee updated successfully");
                setIsEditModalOpen(false);
                window.location.reload();
            } else {
                console.error("Error updating employee");
                console.log(response);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleDelete = async (enrollmentNumber) => {
        try {
            const response = await fetch(
                `http://localhost:5000/deleteStudent/${enrollmentNumber}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                console.log("Employee deleted successfully");
                window.location.reload(); // You may want to consider a more React-friendly way to update the UI
            } else {
                console.error("Error deleting employee");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleDeleteClick = (enrollmentNumber) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (confirmDelete) {
            handleDelete(enrollmentNumber);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/getallstudent"
                );
                const data = await response.json();
                setStudentData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="mainadmindiv">
            <AdminHeader />

            {isAddModalOpen && (
                <div className="modal-container">
                    <div className="modal-content">
                        <h2>Add New Student</h2>
                        <form onSubmit={handleAddStudent} className="form_fac">
                            <input
                                type="number"
                                className="select_fields"
                                placeholder="Enroll. Number"
                                name="enrollmentNumber"
                                value={newStudent.enrollmentNumber}
                                onChange={(e) =>
                                    setNewStudent({
                                        ...newStudent,
                                        enrollmentNumber: parseInt(
                                            e.target.value
                                        ),
                                    })
                                }
                            />
                            <input
                                type="text"
                                name="name"
                                className="select_fields"
                                placeholder="Name"
                                value={newStudent.name}
                                onChange={(e) =>
                                    setNewStudent({
                                        ...newStudent,
                                        name: e.target.value,
                                    })
                                }
                            />
                            <input
                                type="text"
                                name="department"
                                className="select_fields"
                                placeholder="Department"
                                value={newStudent.department}
                                onChange={(e) =>
                                    setNewStudent({
                                        ...newStudent,
                                        department: e.target.value,
                                    })
                                }
                            />
                            <input
                                type="text"
                                placeholder="semester"
                                className="select_fields"
                                name="semester"
                                value={newStudent.semester}
                                onChange={(e) =>
                                    setNewStudent({
                                        ...newStudent,
                                        semester: e.target.value,
                                    })
                                }
                            />

                            <input
                                type="text"
                                placeholder="division"
                                className="select_fields"
                                name="division"
                                value={newStudent.division}
                                onChange={(e) =>
                                    setNewStudent({
                                        ...newStudent,
                                        division: e.target.value,
                                    })
                                }
                            />
                            <input
                                type="text"
                                placeholder="Roll Number"
                                className="select_fields"
                                name="rollNumber"
                                value={newStudent.rollNumber}
                                onChange={(e) =>
                                    setNewStudent({
                                        ...newStudent,
                                        rollNumber: e.target.value,
                                    })
                                }
                            />
                            <input
                                placeholder="Password"
                                type="password"
                                className="select_fields"
                                name="password"
                                value={newStudent.password}
                                onChange={(e) =>
                                    setNewStudent({
                                        ...newStudent,
                                        password: e.target.value,
                                    })
                                }
                            />
                            <input
                                placeholder="Confirm Password"
                                type="cpassword"
                                className="select_fields"
                                name="cpassword"
                                value={newStudent.cpassword}
                                onChange={(e) =>
                                    setNewStudent({
                                        ...newStudent,
                                        cpassword: e.target.value,
                                    })
                                }
                            />
                            <div className="modal-buttons">
                                <button type="submit">Add Faculty</button>
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="horcon">
                <AdminSideBar />
                <div className="datamaincon">
                    <button
                        className="operation-btn edit adddataabtn"
                        onClick={() => {
                            handleAddClick();
                        }}
                    >
                        Add New
                    </button>
                    <h1 className="fach1">Student Data</h1>
                    <table className="dark-table">
                        <thead>
                            <tr>
                                <th>Enrollment Number</th>
                                <th>Enrollment Name</th>
                                <th>Department</th>
                                <th>Semester</th>
                                <th>Roll no.</th>
                                <th>Division</th>
                                <th>Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentData.map((student) => (
                                <tr key={student.enrollmentNumber}>
                                    <td>{student.enrollmentNumber}</td>
                                    <td>{student.name}</td>
                                    <td>{student.department}</td>
                                    <td>{student.semester}</td>
                                    <td>{student.rollNumber}</td>
                                    <td>{student.division}</td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                handleEditClick(student)
                                            }
                                            className="operation-btn edit"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteClick(
                                                    student.enrollmentNumber
                                                )
                                            }
                                            className="operation-btn delete"
                                        >
                                            Delete
                                        </button>
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

export default ManageFaculty;
