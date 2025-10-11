// tabelas do banco de dados
export interface Usuario {
    id: string;
    nome_usuario: string;
    email_usuario: string;
    senha_usuario: string;
    createdAt: Date;
    updatedAt: Date;
}