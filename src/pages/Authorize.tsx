import { Outlet } from "react-router-dom";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";

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
            <h3>This is a login</h3>
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
            >
                Login
            </Button>
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
            <h3>This is a register</h3>
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
            >
                Register
            </Button>
        </>
    );
}

export default function Authorize() {
    return (
        <>
            <h2>This is authorize</h2>

            <Container
                sx={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
                <Outlet />
            </Container>
        </>
    );
}
