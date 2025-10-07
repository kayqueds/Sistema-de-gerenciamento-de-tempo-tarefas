import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { useState } from "react";
import RotasSite from "./routes/RotasSite";
import Navigation from "./components/common/navigation/Navigation.jsx";
import Loading from "./pages/loading/Loading";
import Footer from "./components/common/footer/Footer";

function App() {
  const [showLoading, setShowLoading] = useState(true);

  const handleLoadingComplete = () => {
    setShowLoading(true);
  };

  return (
    <>
      {showLoading && (
        <Loading duration={1500} onLoadingComplete={handleLoadingComplete} />
      )}
      <BrowserRouter>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <RotasSite />
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
