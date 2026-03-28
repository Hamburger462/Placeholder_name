import { useContext } from "react";
import { authContext } from "../context/authContext";

import Button from "@mui/material/Button";

import { signoutUser } from "../database/auth";

import { useNavigate } from "react-router-dom";

export default function Profile() {
    const context = useContext(authContext);

    const navigate = useNavigate();

    return (
        <>
            <h1>Profile</h1>
            <div className="ProfileMain">
                {/* <img></img> */}
                <div className="ProfileData">
                    <div>Email: {context?.authInfo?.email}</div>
                    <div>Username: {context?.authInfo?.username}</div>
                    <Button
                        onClick={() => {
                            signoutUser();
                            navigate("/");
                        }}
                        variant="contained"
                        sx={{
                            backgroundColor: "#d6cbb8",
                            color: "#121417",
                        }}
                    >
                        Sign out
                    </Button>
                </div>
            </div>
        </>
    );
}
