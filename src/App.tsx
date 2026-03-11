import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Main from "./pages/Main";
import Archive from "./pages/Archive";
import Authorize, { Login, Register } from "./pages/Authorize";
import Profile from "./pages/Profile";

// import { subscribeCases } from "./database/firebase";

import { authContext } from "./context/authContext";

import { auth, db } from "./database/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";

import { useEffect, useContext } from "react";

function App() {
    const context = useContext(authContext);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                context?.setAuthInfo(null);
                console.log("No signed-in user present");

                return;
            }

            const userDoc = await getDoc(doc(db, "Users", user.uid));

            if (userDoc.exists()) {
                const profile = userDoc.data();
                context?.setAuthInfo({
                    id: user.uid,
                    email: profile.email,
                    username: profile.username,
                });
            }
        });
    }, []);

    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Main />} />
                <Route path="/archive" element={<Archive />} />
                <Route element={<Authorize />}>
                    <Route path="/auth/login" element={<Login />}></Route>
                    <Route path="/auth/register" element={<Register />}></Route>
                </Route>
                <Route path="/profile" element={<Profile />} />
            </Route>
        </Routes>
    );
}

export default App;
