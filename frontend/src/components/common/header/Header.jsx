import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <nav className="header-navbar">
      <div className="header-container">
        <Link className="header-brand" to="/">
          Organix
        </Link>
        <button
          className="header-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#headerNav"
        >
          <span className="header-toggler-icon"></span>
        </button>
        <div className="header-collapse" id="headerNav">
          <ul className="header-nav">
            <li className="header-nav-item">
              <Link className="header-nav-link" to="/">
                Início
              </Link>
            </li>
            <li className="header-nav-item">
              <a className="header-nav-link" href="#about">
                Sobre
              </a>
            </li>
            <li className="header-nav-item">
              <Link className="header-nav-link" to="/cadastro">
                Cadastro
              </Link>
            </li>
            <li className="header-nav-item">
              <Link className="header-nav-link" to="/login">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
