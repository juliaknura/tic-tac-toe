import React, { useState } from 'react';
import UserPool from "./UserPool";
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import "./Cognito.css";

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const manageLogin = async (e) => {
        e.preventDefault();

        const user = new CognitoUser({
            Username: username,
            Pool: UserPool
        });

        const authenticationDetails = new AuthenticationDetails({
            Username: username,
            Password: password
        });

        user.authenticateUser(authenticationDetails, {
            onSuccess: data => {
                console.log('authentication succeeded: ', data);
                localStorage.setItem('accessToken', data.getAccessToken().getJwtToken());
                localStorage.setItem('refreshToken', data.getRefreshToken().getToken());
                window.location.reload();
            },
            onFailure: err => {
                console.error('authentication failed: ', err);
            }
        });
    };

    return (
        <div className="text-center" id="loginBox">
            {
                <form className="loginForm" onSubmit={manageLogin}>
                    <input
                        className="loginInput"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="loginInput"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="loginButton" type="submit">Sign in</button>
                </form>
            }
        </div>
    );
};

export default SignIn;