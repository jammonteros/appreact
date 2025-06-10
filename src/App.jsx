import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StreamingApp from "./components/StreamingApp";
import AdminPanel from "./components/AdminPanel";
import VideoPlayerPage from "./components/VideoPlayerPage";
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StreamingApp />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/login" element={<Login />} />
        <Route path="/watch/:id" element={<VideoPlayerPage />} /> {/* ✅ ESTA ES LA RUTA QUE FALTABA */}
      </Routes>
    </Router>
  );
}

export default App;
