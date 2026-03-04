import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Main from "./pages/Main";
import Archive from "./pages/Archive";

import Authorize, {Login, Register} from "./pages/Authorize";

function App() {

    return (
        <>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Main />}></Route>
                    <Route path="/archive" element={<Archive />}></Route>
                    <Route element={<Authorize />}>
                        <Route path="/auth/login" element={<Login />}></Route>
                        <Route path="/auth/register" element={<Register />}></Route>
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;
