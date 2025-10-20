import { motion } from "framer-motion";
import "./Sobre.css";

// Import do CSS do Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css';

import gabrielImg from "../../assets/gabriel.png";
import KayqueImg from "../../assets/kayque.jpg";
import AndreImg from "../../assets/andre.png";
import MarinaImg from "../../assets/marina.jpeg";
import LuisImg from "../../assets/luis.jpeg";

const developers = [
  {
    name: "Gabriel Lopes Slovak",
    role: "Frontend Developer",
    img: gabrielImg,
    instagram: "https://www.instagram.com/slovakgabriellopes/#",
    github: "https://github.com/gabriel-slovak",
    linkedin: "#"
  },
  {
    name: "Kayque Estevão",
    role: "Backend Developer",
    img: KayqueImg,
    instagram: "https://www.instagram.com/kayqueestevao29/#",
    github: "https://github.com/kayqueds",
    linkedin: "http://linkedin.com/in/kayquequeiroga"
  },
  {
    name: "André Cenaque",
    role: "Fullstack Developer",
    img: AndreImg,
    instagram: "#",
    github: "#",
    linkedin: "#"
  },
  {
    name: "Marina Duarte",
    role: "DevOps Engineer",
    img: MarinaImg,
    instagram: "https://www.instagram.com/rinduart_?igsh=MXZ1dG43Z29yNjNyMg==",
    github: "https://github.com/MarinaDuarteC",
    linkedin: "#"
  },
  {
    name: "Luis Henrique",
    role: "UI/UX Designer",
    img: LuisImg,
    instagram: "https://www.instagram.com/luis_riquescs/",
    github: "https://github.com/luishenriquecss",
    linkedin: "http://www.linkedin.com/in/lu%C3%ADs-henrique-santos-789139322"
  },
];

function chunkArray(arr, chunkSize) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
}

function Sobre() {
  const slides = chunkArray(developers, 3);

  return (
    <div className="sobre-container">
      {/* Hero */}
      <section className="sobre-hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="sobre-hero-content"
        >
          <h1>Sobre o TaskFlow</h1>
          <p>
            O <strong>TaskFlow</strong> é um sistema de gerenciamento de tempo e
            tarefas desenvolvido para otimizar sua rotina, melhorar a
            produtividade e simplificar o controle de seus compromissos.
          </p>
        </motion.div>
      </section>

      {/* Missão, Visão, Valores */}
      <section className="sobre-missao">
        <div className="sobre-card">
          <h2>🎯 Missão</h2>
          <p>
            Ajudar pessoas e equipes a organizarem suas tarefas de forma
            inteligente, promovendo equilíbrio entre produtividade e bem-estar.
          </p>
        </div>
        <div className="sobre-card">
          <h2>👁️ Visão</h2>
          <p>
            Ser referência em soluções digitais que tornam o gerenciamento de
            tempo simples, agradável e eficaz.
          </p>
        </div>
        <div className="sobre-card">
          <h2>💡 Valores</h2>
          <p>
            Inovação, simplicidade, transparência e foco na experiência do
            usuário.
          </p>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="sobre-funcionalidades">
        <h2>Principais Funcionalidades</h2>
        <ul>
          <li>✔️ Organização de tarefas por prioridade e prazo</li>
          <li>✔️ Dashboard com métricas de produtividade</li>
          <li>✔️ Sistema de lembretes inteligentes</li>
          <li>✔️ Interface intuitiva e personalizável</li>
        </ul>
      </section>

      {/* Equipe - Carrossel */}
      <section className="sobre-equipe team-boxed">
        <h2>Desenvolvedores</h2>
        <div
          id="developersCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {slides.map((group, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <div className="row justify-content-center">
                  {group.map((dev) => (
                    <div
                      key={dev.name}
                      className="col-12 col-sm-6 col-lg-4 mb-3 d-flex justify-content-center"
                    >
                      <div className="item box">
                        <img
                          className="rounded-circle"
                          src={dev.img}
                          alt={dev.name}
                        />
                        <h3 className="name">{dev.name}</h3>
                        <p className="title">{dev.role}</p>

                        {/* Redes sociais usando Bootstrap Icons */}
                        <div className="social">
                          <a href={dev.instagram} target="_blank" rel="noreferrer">
                            <i className="bi bi-instagram"></i>
                          </a>
                          <a href={dev.github} target="_blank" rel="noreferrer">
                            <i className="bi bi-github"></i>
                          </a>
                          <a href={dev.linkedin} target="_blank" rel="noreferrer">
                            <i className="bi bi-linkedin"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Controles */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#developersCarousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#developersCarousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>
    </div>
  );
}

export default Sobre;
