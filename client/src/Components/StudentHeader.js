import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./ContextProvider/Context";

const StudentHeader = () => {
    const { logindata, setLoginData } = useContext(LoginContext);
    const navigate = useNavigate();

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

        if (data.status === 201) {
            console.log("use logout");
            localStorage.removeItem("usersdatatoken");
            setLoginData(false);
            navigate("/login");
        } else {
            console.log("error");
        }
    };

    const goLogin = () => {
        navigate("/login");
    };
    const goRegister = () => {
        navigate("/");
    };

    return (
        <div className="headerclass">
            <h1 className="headertitle">
                Welcome,{" "}
                {logindata.validUserOne &&
                    logindata.validUserOne.name &&
                    logindata.validUserOne.name}
            </h1>

            {logindata.validUserOne ? (
                <div>
                    <button
                        className="headerbtn"
                        onClick={() => {
                            logoutuser();
                        }}
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div>
                    <button
                        className="headerbtn"
                        onClick={() => {
                            goLogin();
                        }}
                    >
                        Login
                    </button>
                    <button
                        className="headerbtn"
                        onClick={() => {
                            goRegister();
                        }}
                    >
                        Register
                    </button>
                </div>
            )}
        </div>
    );
};

export default StudentHeader;
