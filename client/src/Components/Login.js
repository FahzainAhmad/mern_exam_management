import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LoginContext } from "./ContextProvider/Context";
import GeneralHeader from "./GeneralHeader";

const Login = () => {
    const navigate = useNavigate();
    const [enrollno, setEnrollno] = useState("");
    const [password, setPassword] = useState("");
    const [LoginEmailError, setLoginEmailError] = useState("");
    const [LoginPassError, setLoginPassError] = useState("");
    const [passShow, setPassShow] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState("");
    const { logindata, setLoginData } = useContext(LoginContext);

    const loginHandler = async (e) => {
        e.preventDefault();
        let submit = false;
        if (selectedIndex === "") {
            if (enrollno === "" || password === "") {
                submit = false;
                if (enrollno === "") {
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
            const login_api = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    enrollno,
                    password,
                }),
            });

            const res = await login_api.json();
            console.log(res.status);
            if (res.status === 202) {
                localStorage.setItem("usersdatatoken", res.result.token);
                alert("Login Successfull..!");
                navigate("/dash");
                //alert("done")
                setEnrollno("");
                setPassword("");
            } else {
                alert("Invalid details");
            }
        }
    };

    const DashboardValid = async () => {
        let token = localStorage.getItem("usersdatatoken");
        if (token) {
            const res = await fetch("http://localhost:5000/validuser", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            });

            const data = await res.json();

            if (data.status == 401 || !data) {
                navigate("/*");
            } else {
                console.log("user verify");
                setLoginData(data);
                navigate("/dash");
            }
        } else {
            console.log("user not verify");
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
                                type="enrollno"
                                value={enrollno}
                                onChange={(e) => setEnrollno(e.target.value)}
                                name="enrollno"
                                id="enrollno"
                                placeholder="Enter Your Enrollment No."
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
                            <NavLink to="/">
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
