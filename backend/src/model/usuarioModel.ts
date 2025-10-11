import { connectionModel } from "./connectionModel";
import type { Usuario } from "../interface/tabelas";

// operações de CRUD - banco de dados
const getUsuarioAll =  async () =>{
    const [listUsuarios] = await connectionModel.execute('SELECT * FROM usuarios')
    return listUsuarios
}

const getByUsuarioId =  async (id:number) =>{
    const [usuario] = await connectionModel.execute(`SELECT * FROM usuarios where id=${id}`)
    return usuario
}
// criar usuario    
const createNewUsuario =  async (body: Usuario) =>{
    const {nome_usuario,email_usuario,senha_usuario, createdAt, updatedAt} = body
    const query = 'INSERT INTO usuarios(nome_usuario,email_usuario,senha_usuario,createdAt,updatedAt) values(?,?,?,?,?)'
    const [newUsuario] =  await connectionModel.execute(query,[nome_usuario,email_usuario,senha_usuario,createdAt ?? new Date(),updatedAt ?? new Date()])    
    return newUsuario
}
// editar usuario

const editUsuario =  async (id:number, body:Usuario) =>{
    const {nome_usuario,email_usuario,senha_usuario, createdAt, updatedAt} = body
    const query = 'UPDATE usuarios set nome_usuario=?,email_usuario=?,senha_usuario=?,createdAt=?,updatedAt=? where id = ?'
    const [usuarioEdit] = await connectionModel.execute(query,[nome_usuario,email_usuario,senha_usuario,createdAt ?? new Date(),updatedAt ?? new Date(),id])
    return usuarioEdit
}

const editUsuarioPartial = async (id:number,updates:Partial<Usuario>)=>{
    delete updates.createdAt;
    if(!updates.updatedAt){
        updates.updatedAt = new Date()
    }

    const fields = Object.keys(updates);
    const values =  Object.values(updates);
    const setclause =  fields.map(field => `${field} = ?`).join(', ')
    const query = `UPDATE produto set ${setclause}, updatedAt = NOW() where id= ?`
    const [result] = await connectionModel.execute(query,[...values,id])
    return result
}
// deletar usuario
const removeUsuario =  async (id:number) =>{
    const [usuario] = await connectionModel.execute(`DELETE FROM usuarios where id= ${id}`)
    return usuario
}
// exportando as funções
export default {
    getByUsuarioId,
    getUsuarioAll,
    createNewUsuario,
    editUsuarioPartial,
    removeUsuario   
}

