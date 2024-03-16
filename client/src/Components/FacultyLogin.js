import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FacContext, LoginContext } from "./ContextProvider/Context";
import GeneralHeader from "./GeneralHeader";

const Login = () => {
    const navigate = useNavigate();
    const [empno, setEmpno] = useState("");
    const [password, setPassword] = useState("");
    const [LoginEmailError, setLoginEmailError] = useState("");
    const [LoginPassError, setLoginPassError] = useState("");
    const [passShow, setPassShow] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState("");
    const { faclogindata, setFacLoginData } = useContext(FacContext);

    const loginHandler = async (e) => {
        e.preventDefault();
        let submit = false;
        if (selectedIndex === "") {
            if (empno === "" || password === "") {
                submit = false;
                if (empno === "") {
                    setLoginEmailError("Please Enter Email ");
                } else {
                    setLoginEmailError("");
                }
                if (password === "") {
                    setLoginPassError("Please Enter Password ");
                } else {
                    setLoginPassError("");
                }
            } else {
                submit = true;
            }
        }
        if (submit === true) {
            const login_api = await fetch(
                "http://localhost:5000/facultylogin",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        empno,
                        password,
                    }),
                }
            );

            const res = await login_api.json();
            console.log(res);

            if (res.status === 202 && res.message === "Fac") {
                localStorage.setItem("facdatatoken", res.result.token);
                alert("Login Successfull..!");
                navigate("/dashfac");
                setEmpno("");
                setPassword("");
            } else if (res.status === 202 && res.message === "Admin") {
                console.log("n");
                navigate("/admindash");
            } else {
                alert("Invalid details");
            }
        }
    };

    const DashboardValid = async () => {
        let token = localStorage.getItem("facdatatoken");
        if (token) {
            const res = await fetch("http://localhost:5000/validfac", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            });

            const data = await res.json();

            if (data.status == 401 || !data) {
                console.log("not authorized");
                //navigate("/*");
            } else {
                console.log("faculty verify");
                setFacLoginData(data);
                navigate("/dashfac");
            }
        } else {
            console.log("faculty not verify");
        }
    };

    useEffect(() => {
        setTimeout(() => {
            DashboardValid();
        }, 2000);
    }, []);
    return (
        <>
            <GeneralHeader />
            <div className="mainwindow">
                <div className="form_data">
                    <div className="form_heading">
                        <h1>LOGIN</h1>
                    </div>

                    <form>
                        <div className="form_input">
                            <input
                                type="number"
                                value={empno}
                                onChange={(e) => setEmpno(e.target.value)}
                                name="enrollno"
                                id="enrollno"
                                placeholder="Enter Your Faculty ID"
                                className="txt_fields"
                            />
                        </div>
                        <div style={{ color: "red" }}>{LoginEmailError}</div>
                        <div className="form_input">
                            <div className="two">
                                <input
                                    type={!passShow ? "password" : "text"}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    value={password}
                                    name="password"
                                    id="password"
                                    placeholder="Enter Your password"
                                    className="txt_fields"
                                />
                            </div>
                        </div>
                        <div style={{ color: "red" }}>{LoginPassError}</div>

                        <button className="btn" onClick={loginHandler}>
                            LOGIN
                        </button>
                        <p>
                            Don't have an Account?{" "}
                            <NavLink to="/facultyreg">
                                <button className="btn">REGISTER</button>
                            </NavLink>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
