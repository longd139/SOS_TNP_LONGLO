import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import './App.css';
function App() {
    return (
        <AuthProvider>
            <ToastContainer />
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;
