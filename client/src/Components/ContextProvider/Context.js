import React, { createContext, useState } from "react";

export const LoginContext = createContext("");
export const FacContext = createContext("");

const Context = ({ children }) => {
    const [logindata, setLoginData] = useState([]);
    const [faclogindata, setFacLoginData] = useState([]);
    return (
        <>
            <FacContext.Provider value={{ faclogindata, setFacLoginData }}>
                <LoginContext.Provider value={{ logindata, setLoginData }}>
                    {children}
                </LoginContext.Provider>
            </FacContext.Provider>
        </>
    );
};

export default Context;
