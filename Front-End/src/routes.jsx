import Register from "./pages/register"
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn"
import { getItem } from "./utils/storage";
import Main from "./pages/Main/";


function ProtectedRoutes({ redirectTo }) {
    const isAuthenticated = getItem('token');
    return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
}

function MainRoutes() {
    return (
        <Routes>
            <Route path="/">
                <Route path="/" element={<Register />} />
                <Route path="/register" element={<Register />} />
            </Route>

            <Route exact path="/signIn" element={< SignIn />} />

            <Route path="*" element={<h1>404 - Not found </h1>} />

            <Route element={<ProtectedRoutes redirectTo='/' />}>

                <Route exact path="/main" element={<Main />} />

            </Route>
        </Routes>
    )
}

export default MainRoutes;