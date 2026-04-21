import { RouterProvider } from "react-router";
import "./App.css";
import { routes } from "./app.routes";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useEffect } from "react";

function App() {
  const { handleGetUser } = useAuth();

  useEffect(() => {
    handleGetUser();
  }, []);
  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
