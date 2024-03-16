import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FacContext } from "./ContextProvider/Context";

const FacultyHeader = () => {
    const { faclogindata, setFacLoginData } = useContext(FacContext);
    const navigate = useNavigate();

    const logoutuser = async () => {
        let token = localStorage.getItem("facdatatoken");

        const res = await fetch("http://localhost:5000/logoutfac", {
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
            localStorage.removeItem("facdatatoken");
            setFacLoginData(false);
            navigate("/facultylogin");
        } else {
            console.log("error");
        }
    };

    const goLogin = () => {
        navigate("/facultylogin");
    };
    const goRegister = () => {
        navigate("/facultyreg");
    };

    return (
        <div className="headerclass">
            {faclogindata.validUserOne ? (
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

export default FacultyHeader;
