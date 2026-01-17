import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './components/pages/Home';
import Signup from './components/pages/Signup';
import Signin from './components/pages/Signin';
import Profile from './components/pages/Profile';
import Expense from './components/pages/Expense';
import Error from './components/navigation/Error';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/expense/frontend/api/v1/home" replace />} />
          <Route path="/expense/frontend/api/v1/home" element={<Home />} />
          <Route path="/expense/frontend/api/v1/signup" element={<Signup />} />
          <Route path="/expense/frontend/api/v1/signin" element={<Signin />} />
          <Route
            path="/expense/frontend/api/v1/:userid/:username/profile"
            element={<Profile />}
          />
          <Route
            path="/expense/frontend/api/v1/:userid/:username/expense"
            element={<Expense />}
          />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export default App;
