import "./App.css";
import { useContext, useEffect } from "react";
import { FacContext, LoginContext } from "./Components/ContextProvider/Context";
import { useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import FacultyRegister from "./Components/FacultyRegister";
import FacultyLogin from "./Components/FacultyLogin";
import FacultyDashboard from "./Components/FacultyDashboard";
import AdminDashboard from "./Components/AdminDashboard";
import TakeTestPage from "./Components/TestPage";
import DocView from "./Components/DocPage";
import FacultyManageRes from "./Components/FacultyManageRes";
import FacultyLH from "./Components/FacultyLH";
import Resources from "./Components/Resources";
import ManageStudent from "./Components/ManageStudent";
import AdminLoginHistory from "./Components/AdminLoginHistory";
import BlockedStudents from "./Components/BlockedStudents";
import BlockedStudentsError from "./Components/BlockedStudentsError";
import FacultyResources from "./Components/FacultyResources";
import BlockedStudentsAdmin from "./Components/BlockedStudentsAdmin";

function App() {
    const { setLoginData } = useContext(LoginContext);
    const { setFacLoginData } = useContext(FacContext);

    const navigate = useNavigate();

    const DashboardValid = async () => {
        let token = localStorage.getItem("usersdatatoken");

        if (token) {
            const res = await fetch("/validuser", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            });

            const data = await res.json();

            if (data.status === 401 || !data) {
                console.log("user not valid");
            } else {
                console.log("user verify");
                setLoginData(data);
                navigate("/");
            }
        }
        console.log("user not verify");
    };

    const DashboardFacValid = async () => {
        let token1 = localStorage.getItem("facdatatoken");

        if (token1) {
            const res = await fetch("http://localhost:5000/validfac", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token1,
                },
            });

            const data = await res.json();

            if (data.status === 401 || !data) {
                console.log("Fac not valid");
            } else {
                console.log("Fac verify");
                setFacLoginData(data);
                //navigate("/");
            }
        }
        console.log("user not verify");
    };

    useEffect(() => {
        setTimeout(() => {
            DashboardValid();
            DashboardFacValid();
        }, 2000);
    }, []);

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dash" element={<Dashboard />} />
                <Route path="/dashfac" element={<FacultyDashboard />} />
                <Route path="/dashres" element={<FacultyManageRes />} />
                <Route path="/facloginhistory" element={<FacultyLH />} />
                <Route path="/facultyreg" element={<FacultyRegister />} />
                <Route path="/managestudent" element={<ManageStudent />} />
                <Route path="/facultylogin" element={<FacultyLogin />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/admindash" element={<AdminDashboard />} />
                <Route path="/take-test/:examId" element={<TakeTestPage />} />
                <Route path="/DocView/:examId" element={<DocView />} />
                <Route path="/AdminLH" element={<AdminLoginHistory />} />
                <Route path="/facresources" element={<FacultyResources />} />
                <Route path="/blockstudents" element={<BlockedStudents />} />
                <Route path="/bsadmin" element={<BlockedStudentsAdmin />} />
                <Route
                    path="/blockedstudenterror"
                    element={<BlockedStudentsError />}
                />
            </Routes>
        </div>
    );
}

export default App;
