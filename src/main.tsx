import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";

import { store } from "./app/store.ts";
import { Provider } from "react-redux";

import { CssBaseline } from "@mui/material";


createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <BrowserRouter>
            <CssBaseline />
            <App />
        </BrowserRouter>
    </Provider>,
);
