import { useState, useEffect } from "react";
import "./home.css";
import Banner from "../../components/common/banner/Banner";

function Home() {
  const funcionalidades = [
    {
      nome: "Checklist Inteligente",
      descricao: "Crie tarefas com prazos, lembretes e níveis de prioridade.",
      imagem: "https://media.istockphoto.com/id/1482219003/pt/foto/digital-work-checklist-or-electronic-smart-daily-checklist-concept-check-mark-on-virtual.jpg?s=170667a&w=0&k=20&c=lK9a6jyYoMQYuKvQ96OHNkQt6_xoGQhFHiL0IIpiKz0=",
      link: "#"
    },
    {
      nome: "Análises de Produtividade",
      descricao: "Acompanhe seu desempenho semanal e identifique melhorias.",
      imagem: "https://img.freepik.com/fotos-premium/um-monitor-de-computador-exibindo-varias-visualizacoes-e-analises-de-dados-transmitindo-uma-sensacao-de-eficiencia-e-produtividade-gerador-de-ia_579956-4597.jpg?w=2000",
      link: "#"
    },
    {
      nome: "Colaboração em Equipe",
      descricao: "Compartilhe tarefas e projetos com sua equipe em tempo real.",
      imagem: "https://cdn.pixabay.com/photo/2025/02/21/17/22/teamwork-9422683_1280.png",
      link: "#"
    },
    {
      nome: "Automação de Rotina",
      descricao: "Configure tarefas recorrentes para não esquecer nada importante.",
      imagem: "https://ceosgo.com.br/storage/blog/1603332023021563ed1e75ccc61.png",
      link: "#"
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % funcionalidades.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [funcionalidades.length]);

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + funcionalidades.length) % funcionalidades.length);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % funcionalidades.length);
  };

  return (
    <div className="home-page">
     
      {/* Hero */}
      <Banner 
        titulo="Gerencie seu tempo com eficiência" 
        descricao="TaskBoost é a ferramenta ideal para organizar tarefas, aumentar produtividade e alcançar seus objetivos."
        botaoTexto="Começar Agora"
        botaoLink="/cadastro"
      />

      {/* Carrossel */}
      <section className="funcionalidade-carousel">
        <div className="carousel-container">
          {funcionalidades.map((func, i) => (
            <div
              key={i}
              className="item"
              style={{
                backgroundImage: `url(${func.imagem})`,
                opacity: i === index ? 1 : 0,
                zIndex: i === index ? 2 : 1,
                transition: "opacity 1s ease-in-out"
              }}
            >
              <div className="content">
                <div className="name">{func.nome}</div>
                <div className="des">{func.descricao}</div>
                <a href={func.link}><button>Saiba Mais</button></a>
              </div>
            </div>
          ))}
          <div className="button">
            <button onClick={prevSlide} className="prev">◁</button>
            <button onClick={nextSlide} className="next">▷</button>
          </div>
        </div>
      </section>
    </div>
    
  );
}

export default Home;
