import { createContext, useState } from "react";
import { type User } from "../types/auth";

export type authState = {
    authInfo: User | null;
    setAuthInfo: (user: User | null) => void;
};

export const authContext = createContext<authState | null>(null);

export function AuthContextProvider(props: {children: React.ReactNode}) {
    const [authInfo, setAuthInfo] = useState<User | null>(null);

    return (
        <authContext.Provider value={{ authInfo, setAuthInfo }}>
            {props.children}
        </authContext.Provider>
    );
}
