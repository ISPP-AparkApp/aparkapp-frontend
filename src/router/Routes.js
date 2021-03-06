import Home from "../components/views/Home";
import Login from "../components/views/Login";
import Profile from "../components/views/Profile";
import SearchPlace from "../components/views/SearchPlace";
import Publish from "../components/views/Publish";
import AboutUs from "../components/views/AboutUs";
import SignUp from "../components/views/SignUp";
import MapRoute from "../components/views/MapRoute";
import Notifications from "../components/views/Notifications";
import Activity from "../components/views/Activity";
import Reserve from "../components/views/Reserve";
import Error from "../components/views/Error";
import Credit from "../components/views/Credit";
import Contact from "../components/views/Contact";

const routes = [
    {
        path: "/contact",
        element: <Contact />
    },
    {
        path: "/",
        element: <Home />,
        requireAuth: true,
        fallback: "/login",
    },
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
        path: "/notifications/:id",
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
        fallback: "/login"
    },
    {
        path: "/activity",
        element: <Activity />,
        requireAuth: true,
        fallback: "/login",
    },
    {
        path: "/profile",
        element: <Profile />,
        requireAuth: true,
        fallback: "/login"
    },
    {
        path: "/credit",
        element: <Credit />,
        requireAuth: true,
        fallback: "/login"
    },
    {
        path: "/reserve/:id",
        element: <Reserve />,
        requireAuth: true,
        fallback: "/login"
    },
    {
        path: "/banned",
        element: <Error text="Su cuenta ha sido restringida. 
        Si lo desea puede contactar con el administrador a trav??s del 
        siguiente correo: aparkapp.info@gmail.com"/>,
    },
    {
        path: "*",
        element: <Error />,
    },
];

export default routes;
