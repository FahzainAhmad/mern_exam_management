import { useState, React } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Toga from "../Components/Images/toga.png";
import GeneralHeader from "./GeneralHeader";

const Register = () => {
    const handleDepartmentChange = (e) => {
        setDepartment(e.target.value);
    };

    const navigate = useNavigate();
    const [submit, setSubmit] = useState(false);
    const [enrollmentNumber, setEnrollmentno] = useState("");
    const [EnrollPass, setEnrollPass] = useState("");
    const [name, setName] = useState("");
    const [rollNumber, setRollno] = useState("");
    const [department, setDepartment] = useState("");
    const [className, setClassName] = useState("");
    const [division, setDivision] = useState("");
    const [semester, setSemester] = useState("");
    const [password, setPass] = useState("");
    const [cpassword, setCpass] = useState("");
    const [passShow, setPassShow] = useState(false);
    const [passPass, setPassPass] = useState("");
    const [cpassShow, setCPassShow] = useState(false);

    const passwordShowHideHandler = () => {
        if (passShow === false) {
            setPassShow(true);
        } else {
            setPassShow(false);
        }
    };
    const cPasswordShowHideHandler = () => {
        if (cpassShow === false) {
            setCPassShow(true);
        } else {
            setCPassShow(false);
        }
    };

    const RegisterHandler = async (e) => {
        e.preventDefault();

        if (enrollmentNumber === "") {
            setSubmit(false);
            setEnrollPass("Please Enter Enrollment No.");
        } else {
            setSubmit(true);
            setEnrollPass("");
        }
        if (password === "") {
            setSubmit(false);
            setPassPass("Please Enter Enrollment No.");
        } else {
            setSubmit(true);
            setPassPass("");
        }

        if (submit === true) {
            const data = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    enrollmentNumber,
                    name,
                    rollNumber,
                    department,
                    className,
                    division,
                    semester,
                    password,
                    cpassword,
                }),
            });

            const res = await data.json();
            console.log(res.status);
            if (res.status === 201) {
                alert("user registration done");
                setEnrollmentno("");
                setName("");
                setRollno("");
                setDepartment("");
                setClassName("");
                setDivision("");
                setSemester("");
                setPass("");
                setCpass("");
            } else {
                alert("This Email is Already Exist");
            }
        }
    };

    return (
        <>
            <GeneralHeader />
            <div className="mainwindow">
                <div className="mainimg">
                    <img src={Toga} alt="Student" className="toga" />
                    <p className="unitext">Student Registration</p>
                </div>
                <div className="textsec">
                    <form>
                        <div className="form_input">
                            <input
                                type="number"
                                onChange={(e) =>
                                    setEnrollmentno(e.target.value)
                                }
                                value={enrollmentNumber}
                                name="enrollment_no"
                                id="enrollment_no"
                                placeholder="Enter Your Enrollment No."
                                className="txt_fields"
                            />
                            <div style={{ color: "red" }}>{EnrollPass}</div>
                        </div>

                        <div className="form_input">
                            <input
                                type="text"
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                name="name"
                                id="name"
                                placeholder="Enter Your Name"
                                className="txt_fields"
                            />
                        </div>

                        <div className="form_input">
                            <input
                                type="number"
                                onChange={(e) => setRollno(e.target.value)}
                                value={rollNumber}
                                name="rollno"
                                id="rollno"
                                placeholder="Enter Your Roll No"
                                className="txt_fields"
                            />
                        </div>

                        <select
                            onChange={handleDepartmentChange}
                            value={department}
                            name="department"
                            id="department"
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

                        <div className="form_input">
                            <input
                                type="text"
                                onChange={(e) => setDivision(e.target.value)}
                                value={division}
                                name="division"
                                id="division"
                                placeholder="Enter Your Division"
                                className="txt_fields"
                            />
                        </div>

                        <div className="form_input">
                            <input
                                type="text"
                                onChange={(e) => setSemester(e.target.value)}
                                value={semester}
                                name="semester"
                                id="semester"
                                placeholder="Enter Your Semester"
                                className="txt_fields"
                            />
                        </div>

                        <div className="form_input">
                            <input
                                type={!passShow ? "password" : "text"}
                                onChange={(e) => setPass(e.target.value)}
                                value={password}
                                name="pass"
                                id="pass"
                                placeholder="Enter Your Password"
                                className="txt_fields"
                            />
                            <div style={{ color: "red" }}>{passPass}</div>
                        </div>

                        <div className="form_input">
                            <input
                                type={!passShow ? "password" : "text"}
                                onChange={(e) => setCpass(e.target.value)}
                                value={cpassword}
                                name="cpass"
                                id="cpass"
                                placeholder="Confirm Password"
                                className="txt_fields"
                            />
                        </div>

                        <button className="btn w-100" onClick={RegisterHandler}>
                            REGISTER
                        </button>

                        <p className="alreadyloggedin">
                            Already have an account?{" "}
                            <NavLink to="/login">
                                <button className="btn">LOGIN</button>
                            </NavLink>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Register;
