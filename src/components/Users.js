import React from "react";
import Button from "./Button.js";
import './Button.css';


export default function Users({text}) {
    return <>
       <div className="section-body">
            <div className="section-user">
                <h3> You are a ? </h3>
                <div className="container">
                        <div className="col">
                            <div className="user"></div>
                            <p>Patient</p>
                        </div>
                        <div className="col">
                            <div className="user"></div>
                            {/* <img src="" alt=""/> */}
                            
                            <p>Doctor</p>
                        </div>
                </div>
                <Button text="proceed"></Button>
            </div>
       </div>
    </>
  }