import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Fac from "../Components/Images/female.png";
import GeneralHeader from "./GeneralHeader";

const FacultyRegister = () => {
    const handleDepartmentChange = (e) => {
        setDepartment(e.target.value);
    };

    const [employeeNumber, setEmployeeNumber] = useState("");
    const [name, setName] = useState("");
    const [department, setDepartment] = useState("");
    const [designation, setDesignation] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCpassword] = useState("");

    const RegisterHandler = async (e) => {
        e.preventDefault();

        let isValid = true;

        if (employeeNumber === "") {
            isValid = false;
            alert("Please Enter Enrollment No.");
        }

        if (password === "") {
            isValid = false;
            alert("Please Enter Password.");
        }

        if (isValid) {
            const response = await fetch(
                "http://localhost:5000/facultyregister",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        employeeNumber,
                        name,
                        department,
                        designation,
                        password,
                        cpassword,
                    }),
                }
            );

            const result = await response.json();

            if (result.status === 201) {
                alert("Faculty registration done");
                setEmployeeNumber("");
                setName("");
                setDepartment("");
                setDesignation("");
                setPassword("");
                setCpassword("");
            } else {
                alert("This Enrollment Number is already in use");
            }
        }
    };

    return (
        <>
            <GeneralHeader />
            <div className="mainwindow">
                <div className="mainimg">
                    <img src={Fac} alt="Faculty" className="toga" />
                    <p className="unitext">Faculty Registration</p>
                </div>

                <div className="textsec">
                    <form className="facform">
                        <input
                            type="number"
                            className="txt_fields"
                            name="enrollmentNumber"
                            value={employeeNumber}
                            onChange={(e) => setEmployeeNumber(e.target.value)}
                            placeholder="Enter Faculty ID"
                            required
                        />
                        <br />
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="txt_fields"
                            placeholder="Enter Your Full Name"
                            required
                        />
                        <br />

                        <select
                            onChange={handleDepartmentChange}
                            value={department}
                            name="department"
                            id="department"
                            placeholder="Enter Your Department"
                            className="txt_fields"
                        >
                            <option value="" disabled>
                                Select Your Department
                            </option>
                            <option value="MCA">
                                MCA (Master of Computer Applications)
                            </option>
                            <option value="BTECH">
                                BTECH (Bachelor of Technology)
                            </option>
                            <option value="BCA">
                                BCA (Bachelor of Computer Applications)
                            </option>
                            <option value="IMCA">
                                IMCA (Integrated Master of Computer
                                Applications)
                            </option>
                            <option value="MBA">
                                MBA (Master of Business Administration)
                            </option>
                            <option value="IMBA">
                                IMBA (Integrated Master of Business
                                Administration)
                            </option>
                            <option value="BSC">
                                BSC (Bachelor of Science)
                            </option>
                        </select>

                        <br />
                        <input
                            type="text"
                            name="designation"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            className="txt_fields"
                            placeholder="Enter Your Designation"
                            required
                        />
                        <br />
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="txt_fields"
                            placeholder="Enter Your Password"
                            required
                        />
                        <br />
                        <input
                            type="password"
                            name="cpassword"
                            value={cpassword}
                            onChange={(e) => setCpassword(e.target.value)}
                            className="txt_fields"
                            placeholder="Enter Your Password Again"
                            required
                        />
                        <br />
                        <button onClick={RegisterHandler} className="btn w-100">
                            Register
                        </button>

                        <p className="alreadyloggedin">
                            Already have an account?{" "}
                            <NavLink to="/facultylogin">
                                <button className="btn">LOGIN</button>
                            </NavLink>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default FacultyRegister;
