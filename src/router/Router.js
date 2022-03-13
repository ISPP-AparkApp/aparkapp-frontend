import { Routes, Route } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import routes from "./Routes";

const Router = () => (
    <Routes>
        {routes.map((route) => (
            <Route
                path={route.path}
                element={
                    Object.keys(route).includes("requireAuth") ? (
                        <RequireAuth
                            requireAuth={route.requireAuth}
                            fallback={route.fallback}
                        >
                            {route.element}
                        </RequireAuth>
                    ) : (
                        route.element
                    )
                }
                key={route.path}
            ></Route>
        ))}
    </Routes>
);

export default Router;
