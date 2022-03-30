import Home from "../components/views/Home";
import Login from "../components/views/Login";
import Profile from "../components/views/Profile";
import SearchPlace from "../components/views/SearchPlace";
import Publish from "../components/views/Publish";
import AboutUs from "../components/views/AboutUs";
import SignUp from "../components/views/SignUp";
import MapRoute from "../components/views/MapRoute";
import Notifications from "../components/views/Notifications";
import Reserve from "../components/views/Reserve";
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
        path: "/notifications",
        element: <Notifications />,
        requireAuth: true,
        fallback: "/login",
    },
    {
        path: "/home",
        element: <Home />,
        requireAuth: true,
        fallback: "/about",
    },
    {
        path: "/publish",
        element: <Publish />,
        requireAuth: true,
        fallback: "/login", 
    },
    {
        path: "/search",
        element: <SearchPlace />,
        requireAuth: true,
        fallback: "/login",
    },
    {
        path: "/route/:id",
        element: <MapRoute />,
        requireAuth: true,
        fallback: "login"
    },
    {
        path: "*",
        element: <Navigate to="/home" replace />,
    },
    {
        path: "/profile",
        element: <Profile />,
        requireAuth: true,
        fallback: "login"
    },
    {
        path: "/reserve/:id",
        element: <Reserve />,
        requireAuth: true,
        fallback: "login"
    },
];

export default routes;
