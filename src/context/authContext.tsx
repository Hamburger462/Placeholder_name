import { createContext, useState } from "react";
import { type User } from "../types/auth";

export type authState = {
    authInfo: User | null;
    setAuthInfo: (user: User | null) => void;

    activeCase: string;
    setActiveCase: (id: string) => void;
};

export const authContext = createContext<authState | null>(null);

export function AuthContextProvider(props: { children: React.ReactNode }) {
    const [authInfo, setAuthInfo] = useState<User | null>(null);

    const [activeCase, setActiveCase] = useState<string>("");

    return (
        <authContext.Provider
            value={{ authInfo, setAuthInfo, activeCase, setActiveCase }}
        >
            {props.children}
        </authContext.Provider>
    );
}
