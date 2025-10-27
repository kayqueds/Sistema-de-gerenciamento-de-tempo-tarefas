// tabelas do banco de dados
export interface Usuario {
    id: string;
    nome_usuario: string;
    email_usuario: string;
    senha_usuario: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Tarefa {
    id: string;
    nome_tarefa: string;
    descricao_tarefa: string;
    data_criacao: Date;
    status_tarefa: 'pendente' | 'em andamento' | 'concluida';
    id_usuario: string;
    horario?: string | null;
    prioridade?: 'Baixa' | 'Normal' | 'Alta';
}

