import React from "react";
import { NavLink } from "react-router-dom";

const GeneralHeader = () => {
    return (
        <div className="ghead">
            <NavLink to="/">
                <button className="gheadbtns">Student</button>
            </NavLink>

            <NavLink to="/facultyreg">
                <button className="gheadbtns">Faculty</button>
            </NavLink>
        </div>
    );
};

export default GeneralHeader;
