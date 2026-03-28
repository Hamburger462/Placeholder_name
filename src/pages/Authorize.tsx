import { Outlet } from "react-router-dom";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { useState } from "react";

import { createUser, signUser } from "../database/auth";

import { useNavigate } from "react-router-dom";

const emailRegex = /.+@.+\..+/;
const passRegex = /.{6,}/;
const usernameRegex = /.{6,}/;

export function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [emailValid, setEmailValid] = useState<boolean>(false);
    const [passValid, setPassValid] = useState<boolean>(false);

    const navigate = useNavigate();

    return (
        <>
            <h1>Login</h1>
            <div
                style={{
                    backgroundColor: "#C2A35D",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    padding: "8px",
                    borderRadius: "8px",
                    width: "60%",
                }}
            >
                <TextField
                    label={"Email"}
                    value={email}
                    error={emailValid}
                    onBlur={() => setEmailValid(!emailRegex.test(email))}
                    onChange={(event) =>
                        setEmail((event.target as HTMLInputElement).value)
                    }
                    helperText={
                        emailValid
                            ? "Email must contain the @ followed by . characters"
                            : ""
                    }
                ></TextField>
                <TextField
                    label={"Password"}
                    value={password}
                    error={passValid}
                    onBlur={() => setPassValid(!passRegex.test(password))}
                    onChange={(event) =>
                        setPassword((event.target as HTMLInputElement).value)
                    }
                    helperText={
                        passValid
                            ? "Password must contain 6 or more characters"
                            : ""
                    }
                ></TextField>
                <Button
                    variant="contained"
                    onClick={() => {
                        signUser({ email: email, password: password });
                        navigate("/");
                    }}
                    sx={{
                        backgroundColor: "#d6cbb8",
                        color: "#121417",
                    }}
                >
                    Login
                </Button>
            </div>
        </>
    );
}

export function Register() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");

    const [emailValid, setEmailValid] = useState<boolean>(false);
    const [passValid, setPassValid] = useState<boolean>(false);
    const [nameValid, setNameValid] = useState<boolean>(false);

    const navigate = useNavigate();

    return (
        <>
            <h1>Register</h1>
            <div
                style={{
                    backgroundColor: "#C2A35D",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    padding: "8px",
                    borderRadius: "8px",
                    width: "60%",
                }}
            >
                <TextField
                    label={"Username"}
                    value={username}
                    error={nameValid}
                    onBlur={() => setNameValid(!usernameRegex.test(username))}
                    onChange={(event) =>
                        setUsername((event.target as HTMLInputElement).value)
                    }
                    helperText={
                        nameValid
                            ? "Username must contain 6 or more characters"
                            : ""
                    }
                ></TextField>

                <TextField
                    label={"Email"}
                    value={email}
                    error={emailValid}
                    onBlur={() => setEmailValid(!emailRegex.test(email))}
                    onChange={(event) =>
                        setEmail((event.target as HTMLInputElement).value)
                    }
                    helperText={
                        emailValid
                            ? "Email must contain the @ followed by . characters"
                            : ""
                    }
                ></TextField>

                <TextField
                    label={"Password"}
                    value={password}
                    error={passValid}
                    onBlur={() => setPassValid(!passRegex.test(password))}
                    onChange={(event) =>
                        setPassword((event.target as HTMLInputElement).value)
                    }
                    helperText={
                        passValid
                            ? "Password must contain 6 or more characters"
                            : ""
                    }
                ></TextField>

                <Button
                    variant="contained"
                    onClick={() => {
                        createUser({
                            username: username,
                            email: email,
                            password: password,
                        });
                        navigate("/");
                    }}
                    sx={{
                        backgroundColor: "#d6cbb8",
                        color: "#121417",
                    }}
                >
                    Register
                </Button>
            </div>
        </>
    );
}

export default function Authorize() {
    return <Outlet />;
}
