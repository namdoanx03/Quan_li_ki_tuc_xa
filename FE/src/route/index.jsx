import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import BuildingBlockManagement from "../pages/BuildingBlockManagement";

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "/",
                element : <HomePage/>,
            },
            {
                path : "/quan-li-day-phong",
                element : <BuildingBlockManagement/>,
            },
        ],
    },
]);

export default router;