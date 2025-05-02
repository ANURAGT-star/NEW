import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import IndexML from "./pages/IndexML";
import NotFound from "./pages/NotFound";
import Statistics from "./pages/Statistics";
import Resources from "./pages/Resources";
import Layout from "./components/Layout";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Index /> },
      { path: "/ml", element: <IndexML /> },
      { path: "/statistics", element: <Statistics /> },
      { path: "/resources", element: <Resources /> },
      { path: "*", element: <NotFound /> }
    ]
  }
]);
