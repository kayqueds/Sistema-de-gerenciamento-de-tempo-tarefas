import { useState, useEffect, useRef } from "react";

export default function useCronometro() {
  const [tarefaAtiva, setTarefaAtiva] = useState(null);
  const [tempoRestante, setTempoRestante] = useState(null);
  const timerRef = useRef(null);

  // Converte data + horário para timestamp
  function getTimestamp(tarefa) {
    if (!tarefa.data_tarefa || !tarefa.horario) return null;
    return new Date(`${tarefa.data_tarefa}T${tarefa.horario}:00`).getTime();
  }

  // Iniciar cronômetro manualmente
  function iniciarCronometro(tarefa) {
    const alvo = getTimestamp(tarefa);
    if (!alvo) return;

    setTarefaAtiva(tarefa);
    atualizarTempoRestante(alvo);

    timerRef.current = setInterval(() => {
      atualizarTempoRestante(alvo);
    }, 1000);
  }

  // Atualiza tempo
  function atualizarTempoRestante(alvo) {
    const agora = new Date().getTime();
    const dif = alvo - agora;

    if (dif <= 0) {
      setTempoRestante(0);
      pararCronometro();
      return;
    }
    setTempoRestante(dif);
  }

  // Formatação bonita:  mm:ss
  function formatarTempo(ms) {
    if (ms === null) return "--:--";

    const total = Math.floor(ms / 1000);
    const min = String(Math.floor(total / 60)).padStart(2, "0");
    const seg = String(total % 60).padStart(2, "0");

    return `${min}:${seg}`;
  }

  function pararCronometro() {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }

  function resetarCronometro() {
    pararCronometro();
    setTarefaAtiva(null);
    setTempoRestante(null);
  }

  // Cleanup
  useEffect(() => {
    return () => pararCronometro();
  }, []);

  return {
    tarefaAtiva,
    tempoRestante,
    iniciarCronometro,
    resetarCronometro,
    formatarTempo,
  };
}
