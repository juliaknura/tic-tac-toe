import React, { useState } from 'react';
import UserPool from "./UserPool";
import { CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';
import "./Cognito.css"

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerificationVisible, setIsVerificationVisible] = useState(false);

    const manageSignUp = async(e) => {
        e.preventDefault();

        const attributeList = [];

        const dataEmail = {
              	Name: 'email',
              	Value: email,
              };

        attributeList.push(dataEmail);

        UserPool.signUp(username, password, attributeList, null, function (err, result) {
                if (err) {
                    alert(err.message || JSON.stringify(err));
                    return;
                }
                console.log('user name is ' + result.user.getUsername());
                setIsVerificationVisible(true);
                setEmail('');
                setPassword('');
                alert("Verification code for user "+result.user.getUsername()+" needed");
            });


    };

    const confirmRegistration = async(e) => {
            e.preventDefault();
            const userData = {
                Username: username,
                Pool: UserPool
            };
            const cognitoUser = new CognitoUser(userData);

            cognitoUser.confirmRegistration(verificationCode, true, function (err, result) {
                if (err) {
                    alert(err.message || JSON.stringify(err));
                    return;
                }
                console.log('verification result: ' + result);
                alert("Verification successful");
                setIsVerificationVisible(false);
            });
        };

    return (
        <div className="text-center" id="loginBox">
            {
                <>
                <form className="registerForm" onSubmit={manageSignUp}>
                    <input
                        className="loginInput"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="loginInput"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="loginInput"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        className="loginButton"
                        type="submit"
                    >
                        Sign up
                    </button>
                </form>
                {isVerificationVisible && (
                    <form className="registerForm" onSubmit={confirmRegistration}>
                    <input
                        className="loginInput"
                        type="text"
                        placeholder="Verification Code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                    />
                    <button
                        className="loginButton"
                        type="submit"
                    >
                        Confirm Registration
                    </button>
                    </form>
                )}
                </>
            }
        </div>
    );

};

export default SignUp;