import { Link } from "react-router-dom";
import "./Banner.css";

function Banner({ titulo, descricao, botaoTexto, botaoLink }) {
  return (
    <section className="hero">
      <div className="container">
        <h1>{titulo}</h1>
        <p>{descricao}</p>
        {/* minha logica para renderizar so se existirem */}
        {botaoTexto && botaoLink && (
          <Link to={botaoLink} className="btn-hero">
            {botaoTexto}
          </Link>
        )}
      </div>
    </section>
  );
}
export default Banner;
