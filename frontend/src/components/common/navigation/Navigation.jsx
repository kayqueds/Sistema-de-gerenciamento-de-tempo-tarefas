import { Link, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import "./Navigation.css";
import ThemeToggle from "../ThemeToggle/ThemeToggle.jsx";
import { ThemeContext } from "../theme/Theme.jsx";
import { FiHome, FiUserPlus, FiLogIn, FiInfo } from "react-icons/fi";

function Navigation() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useContext(ThemeContext); // pegando o tema

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navigation-component" data-theme={theme}>
      <div className="navigation-container">
        <Link className="navigation-brand" to="/">
          Organix
        </Link>

        {/* Botão de alternar tema */}
        <ThemeToggle />

        {/* Botão hamburguer */}
        <button className="navigation-toggle" onClick={toggleMenu}>
          <span className="navigation-toggle-icon"></span>
        </button>

        <div className={`navigation-menu ${menuOpen ? "show" : ""}`}>
          <ul className="navigation-list">
            <li className="navigation-item">
              <Link
                className={`navigation-link ${location.pathname === "/" ? "active" : ""}`}
                to="/"
                onClick={closeMenu}
              >
                 <FiHome className="icon" />
                Início
              </Link>
            </li>
            <li className="navigation-item">
              <Link
                className={`navigation-link ${location.pathname === "/sobre" ? "active" : ""}`}
                to="/sobre"
                onClick={closeMenu}
              >
                 <FiInfo className="icon" />
                Sobre
              </Link>
            </li>
            <li className="navigation-item">
              <Link
                className={`navigation-link ${location.pathname === "/cadastro" ? "active" : ""}`}
                to="/cadastro"
                onClick={closeMenu}
              >
                <FiUserPlus className="icon" />
                Cadastro
              </Link>
            </li>
            <li className="navigation-item">
              <Link
                className={`navigation-link ${location.pathname === "/login" ? "active" : ""}`}
                to="/login"
                onClick={closeMenu}
              >
                 <FiLogIn className="icon" />
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
