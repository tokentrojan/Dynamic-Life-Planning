import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/NavBar";
import Login from "./pages/Login";
import Planner from "./pages/Planner";
import SortedTasks from "./pages/SortedTasks";
import UnsortedTasks from "./pages/UnsortedTasks";

function App() {
  const isAuthenticated = true; // replace with Firebase auth logic

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/planner"
          element={isAuthenticated ? <Planner /> : <Navigate to="/login" />}
        />
        <Route
          path="/sorted"
          element={isAuthenticated ? <SortedTasks /> : <Navigate to="/login" />}
        />
        <Route
          path="/unsorted"
          element={
            isAuthenticated ? <UnsortedTasks /> : <Navigate to="/login" />
          }
        />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/planner" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
