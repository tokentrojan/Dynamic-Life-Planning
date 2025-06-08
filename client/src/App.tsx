import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/NavBar";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Planner from "./pages/Planner";
import Tasks from "./pages/Tasks";
import { ReminderManager } from "./components/ReminderManager";
import Settings from "./pages/Settings";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { AuthProvider } from "./AuthProvider";
import { ThemeProvider, useTheme } from "./ThemeContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase"; // Make sure db is exported from firebase.ts
import { Task } from "./types/Task";  // Path to your Task type
import './theme.css';
// Wrapper component to apply theme to the entire app
function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { backgroundColor } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !auth.currentUser) return;

    const unsubscribe = onSnapshot(
      collection(db, "users", auth.currentUser.uid, "tasks"),
      (snapshot) => {
        const userTasks = snapshot.docs.map((doc) => doc.data() as Task);
        setTasks(userTasks);
      }
    );

    return () => unsubscribe();
  }, [isAuthenticated]);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ backgroundColor, minHeight: "100vh" }}>
      <Router>
        {isAuthenticated && (
          <>
            <Navbar />
            <ReminderManager tasks={tasks} />
          </>
        )}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/planner"
            element={isAuthenticated ? <Planner /> : <Navigate to="/login" />}
          />
          <Route
            path="/tasks"
            element={isAuthenticated ? <Tasks /> : <Navigate to="/login" />}
          />
          <Route
            path="/settings"
            element={isAuthenticated ? <Settings /> : <Navigate to="/login" />}
          />
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/planner" : "/login"} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
