import React, { useState, useEffect } from 'react';
import api from '../../api'; // Importe seu cliente Axios
import Chat from './Chat'; // ⭐️ Ajuste o caminho conforme necessário

export default function ChatPage() {
    const [tarefas, setTarefas] = useState([]);
    const [loading, setLoading] = useState(true);

    // Função de busca (igual à usada na Sidebar)
    async function fetchTasks() {
        try {
            const response = await api.get("/tarefas");
            // ⭐️ O estado é atualizado com o array de tarefas
            setTarefas(response.data || []); 
        } catch (error) {
            console.error("Erro ao buscar tarefas para o Chat:", error);
            setTarefas([]);
        } finally {
            setLoading(false);
        }
    }

    // Chama a busca ao carregar o componente
    useEffect(() => {
        fetchTasks();
    }, []);

    // Se estiver carregando, mostra uma mensagem
    if (loading) {
        return (
            <div className="flex justify-center items-center h-full text-lg text-gray-500">
                Carregando tarefas para o chatbot...
            </div>
        );
    }

    // ⭐️ Renderiza o componente Chat, passando o estado 'tarefas' como prop
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">🤖 Seu Assistente de Tarefas</h1>
            {/* ⭐️ CORREÇÃO: Passando o array 'tarefas' */}
            <Chat tarefas={tarefas} /> 
        </div>
    );
}