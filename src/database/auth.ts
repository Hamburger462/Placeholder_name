import { auth, db } from "./firebase";

import { doc, setDoc } from "firebase/firestore";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

export async function createUser(user: {
    username: string;
    email: string;
    password: string;
}) {
    const cred = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password,
    );

    const newUser = cred.user;

    await setDoc(doc(db, "Users", newUser.uid), {
        email: user.email,
        username: user.username,
        createdAt: Date.now(),
        role: "user",
    });
}

export async function signUser(user: { email: string; password: string }) {
    signInWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
            const currentUser = userCredential.user;
            console.log(currentUser);
        })
        .catch((error) => {
            // const errorCode = error.code;
            // const errorMsg = error.message;
            console.error(error);
        });
}

export async function signoutUser() {
    signOut(auth);
}
