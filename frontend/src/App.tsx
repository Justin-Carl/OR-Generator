//@ts-nocheck
import {
  Navigate,
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

import MainLayout from "./components/layout/MainLayout"
import Home from "./pages/Home"
//context
import { AlertProvider } from "@/context/AlertContext"
import { ReceiptProvider } from "@/context/ReceiptContext"
import { UserProvider } from "@/context/UserContext"
import ProtectedRoute from "@/components/AuthLoader";
import Login from "./pages/Login";
import { useEffect } from "react";
const route = [
  {
    path: "/home",
    component: <Home />,
    title: "OR Reader"
  }
]

function AppRoutes() {

  return (
    <AlertProvider>
      <ReceiptProvider>
        <UserProvider>
          <Routes>
            <Route element={<ProtectedRoute />}>

              <Route>
                <Route
                  key="/login"
                  path="/login"
                  element={
                    <Login />
                  }
                />
              </Route>
              <Route
                path="/"
                element={
                  <Navigate
                    to="/login"
                    replace
                  />
                }
              />

              <Route>
                {route.map(({ path, component, title }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <MainLayout title={title}>{component}</MainLayout>
                    }
                  />
                ))}
              </Route>

            </Route>
            {/* Catch-All Error Page */}
            {/* {newRoutes && (
        <Route
          path="*"
          element={<ErrorPage />}
        />
      )} */}
          </Routes >
        </UserProvider>
      </ReceiptProvider>
    </AlertProvider>


  );
}
function App() {
  const basename = import.meta.env.VITE_ROUTER_BASENAME;
  return (
    <>
      <Router basename={basename}>
        <AppRoutes />
      </Router>
    </>
  );
}

export default App;