import React, { useState, useEffect } from 'react';
// 1. Importa o CSS que você já configurou
import './GraficoPrioridade.css'; 

// URL base do seu backend Flask (VERIFIQUE A PORTA CORRETA!)
const BACKEND_URL = 'http://127.0.0.1:5001'; 

// O componente recebe 'tarefas' como uma prop (exemplo)
const GraficoPrioridade = ({ tarefas }) => {
  const [graficoSrc, setGraficoSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrafico = async () => {
      setIsLoading(true);
      setError(null);
      
      // Verifica se há dados para evitar requisições desnecessárias
      if (!tarefas || tarefas.length === 0) {
        setGraficoSrc(null);
        setIsLoading(false);
        return;
      }
      
      try {
        // Faz a requisição POST para o endpoint do Python que gera o PNG
        const response = await fetch(`${BACKEND_URL}/grafico/image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Envia os dados necessários para o Matplotlib gerar o gráfico
          body: JSON.stringify({ tarefas }), 
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}. Verifique o servidor Flask.`);
        }

        // Converte a resposta binária (PNG) em um Blob URL para ser usado na tag <img>
        const imageBlob = await response.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        
        setGraficoSrc(imageObjectURL);
      } catch (err) {
        console.error("Erro ao buscar o gráfico:", err);
        setError("Não foi possível carregar o gráfico. Verifique o console.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrafico();
    
    // Cleanup: Libera o Blob URL da memória
    return () => {
      if (graficoSrc) {
        URL.revokeObjectURL(graficoSrc);
      }
    };
  }, [tarefas, graficoSrc]); // Roda quando a lista de tarefas mudar

  return (
    // 2. Aplica a classe do Card Moderno (CSS)
    <div className="modern-chart-card">
      {/* 3. Aplica a classe do Título Suave (CSS) */}
      <h3 className="card-title">Análise de Prioridade de Tarefas</h3>
      {/* 4. Adiciona o divisor suave (CSS) */}
      <div className="divider"></div>
      
      {/* Mensagens de status */}
      {isLoading && <p className="status-message">Carregando visualização...</p>}
      {error && <p className="error-message">❌ {error}</p>}
      
      {/* Exibe o gráfico se estiver carregado e sem erros */}
      {!isLoading && !error && graficoSrc ? (
        // 
        <img 
          src={graficoSrc} 
          alt="Gráfico de Distribuição por Prioridade" 
          // 5. Aplica a classe de estilização da Imagem (CSS)
          className="chart-image"
        />
      ) : (
        // Mensagem padrão se não houver dados
        !isLoading && !error && <p className="status-message">Sem dados para exibir no gráfico.</p>
      )}
    </div>
  );
};

export default GraficoPrioridade;