import React, { useState } from 'react';
import UserPool from "./UserPool";
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import "./Cognito.css";

const SignOut = () => {

    const manageLogout = async (e) => {
        e.preventDefault();

        const user = UserPool.getCurrentUser();

        if(user) {
            console.log("logout function")
            user.signOut();
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.reload();
        }
    };

    return (
        <div className="text-center" id="loginBox">
            {
                <button className="loginButton" onClick={manageLogout}>Sign out</button>
            }
        </div>
    );
};

export default SignOut;