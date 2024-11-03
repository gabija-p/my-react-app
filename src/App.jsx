import './App.css'
import LogInScreen from './screens/LogInScreen';
import WorkersTableScreen from "./screens/WorkersTableScreen";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/"
            element={<LogInScreen />}>        
          </Route>
          <Route path="/table"
            element={<WorkersTableScreen />}>        
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
