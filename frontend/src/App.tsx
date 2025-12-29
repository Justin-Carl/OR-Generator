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
import { ReceiptProvider } from "@/context/ReceiptContext"

const route = [
  {
    path: "/",
    component: <Home />,
    title: "OR Generator"
  }
]
function AppRoutes() {
  return (
    <ReceiptProvider>
      <Routes>
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


        {/* Catch-All Error Page */}
        {/* {newRoutes && (
        <Route
          path="*"
          element={<ErrorPage />}
        />
      )} */}
      </Routes >
    </ReceiptProvider>

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