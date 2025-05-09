import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/NavBar'
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Planner from './pages/Planner';
import SortedTasks from './pages/SortedTasks';
import UnsortedTasks from './pages/UnsortedTasks';
import CreateTask from './pages/CreateTask';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { AuthProvider } from './AuthProvider';
import Completed from './pages/completed';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup listener on unmount
  }, []);

  if (loading) return <div>Loading...</div>; //return for while the site is loading


  return (
    <AuthProvider>
    <Router>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/planner" element={isAuthenticated ? <Planner /> : <Navigate to="/login" />} />
        <Route path="/sorted" element={isAuthenticated ? <SortedTasks /> : <Navigate to="/login" />} />
        <Route path="/unsorted" element={isAuthenticated ? <UnsortedTasks /> : <Navigate to="/login" />} />
        <Route path="/create" element={isAuthenticated ? <CreateTask /> : <Navigate to="/login"/>} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/planner" : "/login"} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/completed" element={isAuthenticated? <Completed /> :<Navigate to="/login"/>}/>
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
