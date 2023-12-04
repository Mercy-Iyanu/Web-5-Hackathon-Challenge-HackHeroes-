import React from "react";
import Button from "./Button.js";
import './Button.css';


export default function SignIn({text}) {
    return <>
       <div className="section-body">
            <div className="section-user">
                <h3> Enter ID </h3>
                <div className="container">
                    <input type="text" autoFocus placeholder="Enter User ID"/>
                </div>
                <Button text="proceed"></Button>
            </div>
       </div>
    </>
  }