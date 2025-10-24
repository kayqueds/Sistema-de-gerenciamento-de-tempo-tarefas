import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";

function Navigation() {
  const location = useLocation();

  return (
    <nav className="navigation-component">
      <div className="navigation-container">
        <Link className="navigation-brand" to="/">
          Organix
        </Link>

        <div className="navigation-menu">
          <ul className="navigation-list">
            <li className="navigation-item">
              <Link
                className={`navigation-link ${
                  location.pathname === "/" ? "active" : ""
                }`}
                to="/"
              >
                Início
              </Link>
            </li>
            <li className="navigation-item">
              <a className="navigation-link" href="#about">
                Sobre
              </a>
            </li>
            <li className="navigation-item">
              <Link
                className={`navigation-link ${
                  location.pathname === "/cadastro" ? "active" : ""
                }`}
                to="/cadastro"
              >
                Cadastro
              </Link>
            </li>
            <li className="navigation-item">
              <Link
                className={`navigation-link ${
                  location.pathname === "/login" ? "active" : ""
                }`}
                to="/login"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="navigation-toggle" type="button">
          <span className="navigation-toggle-icon"></span>
        </button>
      </div>
    </nav>
  );
}

export default Navigation;
