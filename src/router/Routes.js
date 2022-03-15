import Home from "../components/views/Home";
import Login from "../components/views/Login";
import Publish from "../components/views/Publish";
import { Navigate } from "react-router-dom";

const routes = [
    {
        path: "/login",
        element: <Login />,
        requireAuth: false,
        fallback: "/home",
    },
    {
        path: "/home",
        element: <Home />,
        requireAuth: true,
        fallback: "/login",
    },
    {
        path: "/publish",
        element: <Publish />,
        requireAuth: true,
        fallback: "/login", 
    },
    {
        path: "*",
        element: <Navigate to="/home" replace />,
    },
];

export default routes;
