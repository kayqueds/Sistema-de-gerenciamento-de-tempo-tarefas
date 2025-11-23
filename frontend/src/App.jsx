import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { useState } from "react";
import RotasSite from "./routes/RotasSite";
import Navigation from "./components/common/navigation/Navigation.jsx";
import Loading from "./pages/loading/Loading";
import Footer from "./components/common/footer/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Import do Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// Import do Bootstrap JS
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Import do ThemeProvider
import { ThemeProvider } from "./components/common/theme/Theme.jsx";
import ThemeToggle from "./components/common/ThemeToggle/ThemeToggle.jsx";

function App() {
  const [showLoading, setShowLoading] = useState(true);

  const handleLoadingComplete = () => {
    setShowLoading(true);
  };

  return (
    <ThemeProvider>
      {showLoading && (
        <Loading duration={1500} onLoadingComplete={handleLoadingComplete} />
      )}
      <BrowserRouter>
        <div className="app">
          <Navigation />
          {/* Coloque o ThemeToggle em um local visível, ex.: no Navigation */}
          <ThemeToggle />
          <main className="main-content">
            <RotasSite />
            <ToastContainer position="top-right" />
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
