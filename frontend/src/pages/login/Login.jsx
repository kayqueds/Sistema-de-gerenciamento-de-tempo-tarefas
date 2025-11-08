import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import api from "../../api";
import { toast } from "react-toastify";
import Sound from "../../hooks/Sound";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);

  // Lista de imagens (pode trocar pelas suas)
  const imagens = [
    "https://blogprodutivamente.files.wordpress.com/2022/07/post-como-fazer-lista-de-tarefas-2.jpg?w=1024",
    "https://isoflex.com.br/wp-content/uploads/2022/12/matriz-de-gerenciamento-do-tempo.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/2ee12c73344287.5c06973b51d22.jpg",
  ];

  // importando sons
  const { playSound, listSound } = Sound();

  useEffect(() => {
    const intervalo = setTimeout(() => {
      setIndex((prev) => (prev + 1) % imagens.length);
    }, 4000);
    return () => clearTimeout(intervalo);
  }, [imagens.length]);

  const enviarFormulario = async (e) => {
    e.preventDefault();
    try {
      // Chamar a API para fazer login
      const response = await api.post("/usuarios/login", {
      email_usuario: email,
      senha_usuario: password,
});

      console.log("Login bem-sucedido:", response.data);
      toast.success(`Login bem-sucedido! Bem-vindo de volta ${response.data.nome_usuario}.`);
      playSound(listSound[1]);
      navigate("/dashboard");
      // caso de erro
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Falha no login. Verifique suas credenciais.");
      playSound(listSound[2]);
    }
  };

  const loginGoogle = () => {
    console.log("Login com Google feito");
  };

  return (
    <div className="login-page">
      {/* Conteúdo */}
      <main>
        <div className="login-container">
          {/* Lado esquerdo */}
          <div className="login-left">
            <h2>Bem-vindo de volta!</h2>
            <p>Faça login para continuar</p>

            <form onSubmit={enviarFormulario}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="form-links">
                <Link to="/forgot-password">Esqueci minha senha</Link>
                <Link to="/cadastro">Cadastre-se</Link>
              </div>

              <button onClick={enviarFormulario} type="submit" className="btn-login">
                Login
              </button>

              <div className="divider">ou</div>

              <button type="button"
                className="btn-login-google"
                onClick={loginGoogle}
              >
                Continuar com Google
              </button>
            </form>
          </div>

          {/* Lado direito com imagens */}
          <div className="login-right">
            {imagens.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Slide ${i + 1}`}
                className={`login-img ${i === index ? "active" : ""}`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
