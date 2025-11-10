import Navbar from "./components/Navbar.jsx";
import { useLocation } from "react-router-dom";

function App() {
  const isDashboardPath = useLocation().pathname.includes("dashboard");
  return <div>{!isDashboardPath && <Navbar />}</div>;
}

export default App;
