import React, { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";

const AdminDashboard = () => {
    const [facultyData, setFacultyData] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editedFaculty, setEditedFaculty] = useState({
        employeeNumber: "",
        name: "",
        department: "",
        designation: "",
    });
    const [newFaculty, setNewFaculty] = useState({
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

    const handleAddFaculty = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/facultyregister",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newFaculty),
                }
            );

            if (response.ok) {
                console.log("Faculty added successfully");
                setIsAddModalOpen(false);
                // Optionally, update the facultyData state or refresh the faculty list
            } else {
                console.error("Error adding faculty");
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

    const handleDelete = async (employeeNumber) => {
        try {
            const response = await fetch(
                `http://localhost:5000/deleteEmployee/${employeeNumber}`,
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

    const handleDeleteClick = (employeeNumber) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this employee?"
        );

        if (confirmDelete) {
            handleDelete(employeeNumber);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5000/getallfac");
                const data = await response.json();
                setFacultyData(data);
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
                        <h2>Add New Faculty</h2>
                        <form onSubmit={handleAddFaculty} className="form_fac">
                            <input
                                type="number"
                                className="select_fields"
                                placeholder="Emp. Number"
                                name="employeeNumber"
                                value={newFaculty.employeeNumber}
                                onChange={(e) =>
                                    setNewFaculty({
                                        ...newFaculty,
                                        employeeNumber: parseInt(
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
                                value={newFaculty.name}
                                onChange={(e) =>
                                    setNewFaculty({
                                        ...newFaculty,
                                        name: e.target.value,
                                    })
                                }
                            />
                            <input
                                type="text"
                                name="department"
                                className="select_fields"
                                placeholder="Department"
                                value={newFaculty.department}
                                onChange={(e) =>
                                    setNewFaculty({
                                        ...newFaculty,
                                        department: e.target.value,
                                    })
                                }
                            />
                            <input
                                type="text"
                                placeholder="Designation"
                                className="select_fields"
                                name="designation"
                                value={newFaculty.designation}
                                onChange={(e) =>
                                    setNewFaculty({
                                        ...newFaculty,
                                        designation: e.target.value,
                                    })
                                }
                            />
                            <input
                                placeholder="Password"
                                type="password"
                                className="select_fields"
                                name="password"
                                value={newFaculty.password}
                                onChange={(e) =>
                                    setNewFaculty({
                                        ...newFaculty,
                                        password: e.target.value,
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

            {isEditModalOpen && (
                <div className="modal-container">
                    <div className="modal-content">
                        <h2>Edit Employee</h2>
                        <form onSubmit={handleEditSave} className="form_fac">
                            <input
                                name="employeeNumber"
                                type="hidden"
                                value={editedFaculty.employeeNumber}
                            />
                            <input
                                type="text"
                                name="name"
                                className="select_fields"
                                value={editedFaculty.name}
                                onChange={(e) =>
                                    setEditedFaculty({
                                        ...editedFaculty,
                                        name: e.target.value,
                                    })
                                }
                            />
                            <input
                                type="text"
                                name="department"
                                className="select_fields"
                                value={editedFaculty.department}
                                onChange={(e) =>
                                    setEditedFaculty({
                                        ...editedFaculty,
                                        department: e.target.value,
                                    })
                                }
                            />
                            <input
                                type="text"
                                name="designation"
                                className="select_fields"
                                value={editedFaculty.designation}
                                onChange={(e) =>
                                    setEditedFaculty({
                                        ...editedFaculty,
                                        designation: e.target.value,
                                    })
                                }
                            />
                            <div className="modal-buttons">
                                <button type="submit">Save</button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="horcon">
                <div className="AdminSidebar">
                    <button className="sidebarbtn">Faculty</button>
                    <button className="sidebarbtn">Student</button>
                    <button className="sidebarbtn">Login History</button>
                </div>
                <div className="datamaincon">
                    <button
                        className="operation-btn edit adddataabtn"
                        onClick={() => {
                            handleAddClick();
                        }}
                    >
                        Add New
                    </button>
                    <h1 className="fach1">Faculty Data</h1>
                    <table className="dark-table">
                        <thead>
                            <tr>
                                <th>Employee Number</th>
                                <th>Employee Name</th>
                                <th>Department</th>
                                <th>Designation</th>
                                <th>Date Joined</th>
                                <th>Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {facultyData.map((faculty) => (
                                <tr key={faculty.employeeNumber}>
                                    <td>{faculty.employeeNumber}</td>
                                    <td>{faculty.name}</td>
                                    <td>{faculty.department}</td>
                                    <td>{faculty.designation}</td>
                                    <td>
                                        {new Date(
                                            faculty.dateCreated
                                        ).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                handleEditClick(faculty)
                                            }
                                            className="operation-btn edit"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteClick(
                                                    faculty.employeeNumber
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

export default AdminDashboard;
