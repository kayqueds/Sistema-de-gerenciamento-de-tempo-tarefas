import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Cadastro.css";
import Banner from "../../components/common/banner/Banner";

function Cadastro() {
  // Lista de imagens
  const imagens = [
    "https://blogprodutivamente.files.wordpress.com/2022/07/post-como-fazer-lista-de-tarefas-2.jpg?w=1024",
    "https://isoflex.com.br/wp-content/uploads/2022/12/matriz-de-gerenciamento-do-tempo.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/2ee12c73344287.5c06973b51d22.jpg",
  ];

  const [index, setIndex] = useState(0);

  // Troca de imagem automática
  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndex((prev) => (prev + 1) % imagens.length);
    }, 4000); // troca a cada 4s
    return () => clearInterval(intervalo);
  }, [imagens.length]);

  return (
    <div className="cadastro-page">
      {/* Conteúdo */}
      <div className="banner-container">
      </div>
      <main>
        <div className="cadastro-container">
          {/* Lado esquerdo */}
          <div className="cadastro-left">
            <h2>Crie sua conta</h2>
            <form>
              <input
                type="text"
                className="form-control"
                placeholder="Nome completo"
                required
              />
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                required
              />
              <input
                type="password"
                className="form-control"
                placeholder="Senha"
                required
              />

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="termos"
                  required
                />
                <label className="form-check-label" htmlFor="termos">
                  Aceito os termos de uso
                </label>
              </div>

              <button type="submit" className="btn-cadastrar">
                Cadastrar
              </button>
            </form>

            <Link to="/login" className="link-login link">
              Já tem conta? Faça login
            </Link>
          </div>

          {/* Lado direito com imagens dinâmicas */}
          <div className="cadastro-right">
            {imagens.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Ilustração cadastro ${i}`}
                className={i === index ? "active" : ""}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Cadastro;
