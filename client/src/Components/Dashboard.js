import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./ContextProvider/Context";
import StudentHeader from "./StudentHeader";

const Dashboard = () => {
    const { logindata, setLoginData } = useContext(LoginContext);
    const [list, setList] = useState([]);
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

        if (data.status == 201) {
            console.log("use logout");
            localStorage.removeItem("usersdatatoken");
            setLoginData(false);
            navigate("/");
        } else {
            console.log("error");
        }
    };

    // const goDash = () => {
    //     navigate("/dash")
    // }

    const goLogin = () => {
        navigate("/login");
    };
    const goRegister = () => {
        navigate("/register");
    };

    const DashboardValid = async () => {
        let token = localStorage.getItem("usersdatatoken");
        console.log(token);
        if (token) {
            const res = await fetch("http://localhost:5000/validuser", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            });

            const data = await res.json();
            console.log("Here : " + data);

            if (data.status === 401 || !data) {
                console.log("issue");
            } else {
                console.log("user verify");
                setLoginData(data);
            }
        } else {
            console.log("user not verify");
        }
    };

    const getData = async () => {
        const res = await fetch("/getdata", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();
        if (res.status === 422 || !data) {
            console.log("error");
        } else {
            setList(data);
        }
    };

    useEffect(() => {
        DashboardValid();
    }, []);
    return (
        <>
            <StudentHeader />
            <h1>Dashboard</h1>
            <h1>
                User Roll. No.:
                {logindata.validUserOne && logindata.validUserOne.rollNumber}
            </h1>
            <h1>
                User Enroll. No.:
                {logindata.validUserOne &&
                    logindata.validUserOne.enrollmentNumber}
            </h1>
            <h1>
                User Name:
                {logindata.validUserOne && logindata.validUserOne.name}
            </h1>
            <h1>
                User Department:
                {logindata.validUserOne && logindata.validUserOne.department}
            </h1>
            <h1>
                User Division:
                {logindata.validUserOne && logindata.validUserOne.division}
            </h1>
            <h1>
                User Semester:
                {logindata.validUserOne && logindata.validUserOne.semester}
            </h1>
        </>
    );
};

export default Dashboard;
