# Validação de Complexidade de Senha

## 📋 Descrição

Sistema completo de validação de senha implementado tanto no **backend** quanto no **frontend**, garantindo segurança e boa experiência do usuário.

---

## 🔐 Regras de Validação

A senha deve atender aos seguintes requisitos:

1. **Mínimo 8 caracteres**
2. **Pelo menos 1 letra maiúscula** (A-Z)
3. **Pelo menos 1 número** (0-9)
4. **Pelo menos 1 caractere especial** (!@#$%^&*()_+-=[]{}...)

---

## 🎯 Backend

### Arquivos Modificados:

#### 1. `backend/src/model/usuarioModel.ts`
- **Função `validarSenha()`**: Valida a complexidade da senha
- **Retorna**: Objeto com `valido` (boolean) e `erros` (array de strings)
- Aplicada nas funções:
  - `createUsuario()`
  - `updateUsuario()`
  - `updateUsuarioPartial()`

#### 2. `backend/src/controller/usuarioController.ts`
- **Nova função**: `validarSenhaComplexidade()`
- Endpoint para validação em tempo real

#### 3. `backend/src/routes/usuarioRouter.ts`
- **Nova rota**: `POST /usuarios/validar-senha`
- Body: `{ "senha": "SuaSenha123!" }`

### Exemplo de Resposta de Erro:

```json
{
  "mensagem": "Erro ao criar usuário.",
  "erro": "A senha deve conter no mínimo 8 caracteres; A senha deve conter pelo menos uma letra maiúscula"
}
```

---

## 💻 Frontend

### Arquivos Criados:

#### 1. `frontend/src/components/common/PasswordStrength/PasswordStrength.jsx`
Componente React que exibe:
- **Força da senha**: Fraca, Média ou Forte
- **Barra de progresso colorida**
- **Lista de requisitos** com indicadores visuais (✓/✗)

#### 2. `frontend/src/components/common/PasswordStrength/PasswordStrength.css`
Estilos do componente com:
- Cores indicativas (Verde = Forte, Amarelo = Média, Vermelho = Fraca)
- Animações suaves
- Design responsivo

### Arquivos Modificados:

#### 3. `frontend/src/pages/cadastro/Cadastro.jsx`
- **Importação**: Componente `PasswordStrength`
- **Validação local**: Função `validarSenha()` antes de enviar ao backend
- **Feedback visual**: Componente exibido abaixo do campo de senha
- **Mensagens de erro**: Toast com descrição específica

---

## 🎨 Como Funciona

### No Cadastro:

1. **Usuário digita a senha**
2. **Componente atualiza em tempo real**:
   - Mostra força da senha (Fraca/Média/Forte)
   - Marca requisitos atendidos com ✓ (verde)
   - Marca requisitos não atendidos com ✗ (vermelho)
3. **Ao submeter**:
   - Validação local primeiro (mensagem de erro imediata)
   - Se válida, envia ao backend
   - Backend valida novamente (segurança)
   - Retorna erro específico se inválida

---

## 🧪 Exemplos de Senhas

| Senha | Status | Requisitos Atendidos |
|-------|--------|---------------------|
| `abc123` | ❌ Fraca | Menos de 8 caracteres, sem maiúscula, sem especial |
| `Abcd1234` | ⚠️ Média | 8+ caracteres, maiúscula, número, **falta especial** |
| `Senha@123` | ✅ Forte | Todos os requisitos ✓ |
| `MyP@ssw0rd!` | ✅ Forte | Todos os requisitos ✓ |

---

## 🚀 Como Testar

### 1. Inicie o Backend:
```bash
cd backend
npm install
npm run dev
```

### 2. Inicie o Frontend:
```bash
cd frontend
npm install
npm run dev
```

### 3. Acesse a Página de Cadastro:
- Navegue até: `http://localhost:5173/cadastro`
- Digite diferentes senhas e observe o feedback em tempo real
- Tente cadastrar com senha fraca (verá mensagem de erro)
- Cadastre com senha forte (sucesso!)

---

## 📌 Notas Importantes

- ✅ Validação **dupla**: Frontend (UX) + Backend (Segurança)
- ✅ Feedback **em tempo real** para o usuário
- ✅ Mensagens de erro **específicas e claras**
- ✅ Design **intuitivo e acessível**
- ✅ Código **reutilizável** (componente pode ser usado em outras páginas)

---

## 🔄 Próximos Passos (Opcional)

- [ ] Adicionar validação na página de "Alterar Senha"
- [ ] Implementar timeout para ocultar requisitos após senha forte
- [ ] Adicionar internacionalização (i18n)
- [ ] Criar testes unitários para validação

---

**Desenvolvido com ❤️ para segurança e UX**
