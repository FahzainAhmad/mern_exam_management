import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FacContext, LoginContext } from "./ContextProvider/Context";
import FacultyHeader from "./FacultyHeader";

const FacultyDashboard = () => {
    const { faclogindata, setFacLoginData } = useContext(FacContext);
    const [list, setList] = useState([]);
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

        if (data.status == 201) {
            console.log("use logout");
            localStorage.removeItem("facdatatoken");
            setFacLoginData(false);
            navigate("/facultylogin");
        } else {
            console.log("error");
        }
    };

    // const goDash = () => {
    //     navigate("/dash")
    // }

    const goLogin = () => {
        navigate("/facultylogin");
    };
    const goRegister = () => {
        navigate("/facultyreg");
    };

    const DashboardValid = async () => {
        let token = localStorage.getItem("facdatatoken");
        console.log(token);
        if (token) {
            const res = await fetch("http://localhost:5000/validfac", {
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
                setFacLoginData(data);
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
            <FacultyHeader />
            <h1>Dashboard</h1>
            <h1>
                User Emp. No.:
                {faclogindata.validUserOne &&
                    faclogindata.validUserOne.employeeNumber}
            </h1>
            <h1>
                User Name:
                {faclogindata.validUserOne && faclogindata.validUserOne.name}
            </h1>
            <h1>
                User Department:
                {faclogindata.validUserOne &&
                    faclogindata.validUserOne.department}
            </h1>
            <h1>
                User Designation:
                {faclogindata.validUserOne &&
                    faclogindata.validUserOne.designation}
            </h1>
        </>
    );
};

export default FacultyDashboard;
