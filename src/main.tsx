import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";

import { store } from "./app/store.ts";
import { Provider } from "react-redux";

import { CssBaseline } from "@mui/material";

import { SubscribeFirestore } from "./database/firestore.ts";

import { AuthContextProvider } from "./context/authContext.tsx";

import { GlobalStyles } from "@mui/material";

import "./styles/main.css";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <BrowserRouter>
            <AuthContextProvider>
                <SubscribeFirestore />
                    <CssBaseline />
                    <GlobalStyles styles={{
                        body: {
                            backgroundColor: "#121417",
                            color: "#E6E6E6",
                        }
                    }}></GlobalStyles>
                    <App />


            </AuthContextProvider>
        </BrowserRouter>
    </Provider>,
);
