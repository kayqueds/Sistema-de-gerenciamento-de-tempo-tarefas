import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Navigation.css";

function Navigation() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navigation-component">
      <div className="navigation-container">
        <Link className="navigation-brand" to="/" onClick={closeMenu}>
          Organix
        </Link>

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
                Início
              </Link>
            </li>
            <li className="navigation-item">
              <Link
                className={`navigation-link ${location.pathname === "/sobre" ? "active" : ""}`}
                to="/sobre"
                onClick={closeMenu}
              >
                Sobre
              </Link>
            </li>
            <li className="navigation-item">
              <Link
                className={`navigation-link ${location.pathname === "/cadastro" ? "active" : ""}`}
                to="/cadastro"
                onClick={closeMenu}
              >
                Cadastro
              </Link>
            </li>
            <li className="navigation-item">
              <Link
                className={`navigation-link ${location.pathname === "/login" ? "active" : ""}`}
                to="/login"
                onClick={closeMenu}
              >
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
