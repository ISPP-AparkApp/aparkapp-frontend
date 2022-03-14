import Home from "../components/views/Home";
import Login from "../components/views/Login";
import AboutUs from "../components/views/AboutUs";
import SignUp from "../components/views/SignUp";
import Vehicle from "../components/views/Vehicle";
import { Navigate } from "react-router-dom";

const routes = [
    {
        path: "/about",
        element: <AboutUs />,
    },
    {
        path: "/login",
        element: <Login />,
        requireAuth: false,
        fallback: "/home",
    },
    {
        path: "/signup",
        element: <SignUp />,
        requireAuth: false,
        fallback: "/home",
    },
    {
        path: "/vehicle",
        element: <Vehicle />,
        requireAuth: false,
        fallback: "/home",
    },
    {
        path: "/home",
        element: <Home />,
        requireAuth: true,
        fallback: "/about",
    },
    {
        path: "*",
        element: <Navigate to="/home" replace />,
    },
];

export default routes;
