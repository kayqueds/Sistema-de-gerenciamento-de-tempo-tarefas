import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./Cadastro.css";
// usar toastify no alert

function Cadastro() {
  const navigate = useNavigate();

  // testar aleta com toastify
  useEffect(() => {
  toast.info("Teste de toast!");
}, []);


  const imagens = [
    "https://blogprodutivamente.files.wordpress.com/2022/07/post-como-fazer-lista-de-tarefas-2.jpg?w=1024",
    "https://isoflex.com.br/wp-content/uploads/2022/12/matriz-de-gerenciamento-do-tempo.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/2ee12c73344287.5c06973b51d22.jpg",
  ];

  const [index, setIndex] = useState(0);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Troca automática de imagem
  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndex((prev) => (prev + 1) % imagens.length);
    }, 4000);
    return () => clearInterval(intervalo);
  }, [imagens.length]);

   const cadastrar = async (e) => {
    e.preventDefault();

    const nome_usuario = e.target[0].value;
    const email_usuario = e.target[1].value;
    const senha_usuario = e.target[2].value;

    try {
      const response = await axios.post("http://localhost:3000/usuarios", {
        nome_usuario,
        email_usuario,
        senha_usuario,
      });
      console.log(response.data);
      toast.success("Cadastro realizado com sucesso!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("❌ Erro ao cadastrar:", error);
      toast.error("Erro ao cadastrar. Tente novamente.");
    }
  };

  return (
    <div className="cadastro-page">
      <div className="banner-container"></div>
      <main>
        <div className="cadastro-container">
          {/* Lado esquerdo */}
          <div className="cadastro-left">
            <h2>Crie sua conta</h2>

            <form onSubmit={cadastrar}>
              <input
                type="text"
                className="form-control"
                placeholder="Nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />

              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                className="form-control"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
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

          {/* Lado direito */}
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
