import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import VerifyPage from "./pages/VerifyPage.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";

function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/verify" element={<VerifyPage />} />
                </Routes>
            </div>
        </AuthProvider>
    );
}

export default App;
