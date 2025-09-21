import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Configure the router with future flags enabled
export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Index />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
  {
    future: {
      // Enable v7 features to remove warnings
      v7_normalizeFormMethod: true,
    },
  }
);