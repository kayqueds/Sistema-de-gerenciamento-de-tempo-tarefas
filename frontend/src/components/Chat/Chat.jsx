import { useState } from 'react';
import './Chat.css';

// ⭐️ Garante que 'tarefas' é recebida como prop
export default function Chat({ tarefas }) { 
  const [messages, setMessages] = useState([{
    role: 'bot',
    text: 'Olá! Pergunte sobre suas tarefas: "Quantas tarefas tenho hoje?", "Listar pendentes", "Tarefas altas".'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

	const CHAT_URL = import.meta.env.VITE_CHATBOT_URL || 'http://localhost:5001/chatbot';

	const send = async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg = { role: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);
		try {
			const res = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            mensagem: text, 
            tarefas: tarefas
        }),
      });
      if (!res.ok) {
				const textErr = `Erro ${res.status} ao contatar ${CHAT_URL}`;
				setMessages((m) => [...m, { role: 'bot', text: textErr }]);
      } else {
        const j = await res.json();
        const botText = j.resposta || 'Desculpe, não entendi.';
        setMessages((m) => [...m, { role: 'bot', text: botText }]);
      }
    } catch (e) {
			const detail = e && e.message ? e.message : String(e);
			setMessages((m) => [...m, { role: 'bot', text: `Erro ao contactar o servidor de chatbot: ${detail}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-card">
      <div className="chat-header">Chatbot</div>
      <div className="chat-body">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role === 'user' ? 'user' : 'bot'}`}>
            <div className="chat-text">{m.text}</div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escreva sua pergunta..." />
        <button onClick={send} disabled={loading}>{loading ? 'Enviando...' : 'Enviar'}</button>
      </div>
    </div>
  );
}