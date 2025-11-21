# Flask Grafico Service

Serviço mínimo em Python/Flask que recebe uma lista de tarefas e retorna dados para gráfico e/ou uma imagem PNG do gráfico.

Endpoints
- `POST /grafico/data` — body JSON `{ "tarefas": [ ... ] }` retorna JSON com `labels`, `values` e `counts`.
- `POST /grafico/image` — body JSON `{ "tarefas": [ ... ] }` retorna uma imagem PNG do gráfico (pie chart).
- `GET /grafico/sample` — retorna um payload de exemplo.

Execução local

1. Criar e ativar venv (Windows PowerShell):
```
cd flask_grafico
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Executar:
```
python app.py
```

3. Testar com `curl` (exemplo):
```
curl -X POST http://localhost:5001/grafico/data -H "Content-Type: application/json" -d "{\"tarefas\":[{\"prioridade\":\"Alta\"},{\"status_tarefa\":\"em andamento\"}]}"

curl -X POST http://localhost:5001/grafico/image -H "Content-Type: application/json" -d "{\"tarefas\":[{\"prioridade\":\"Alta\"},{\"status_tarefa\":\"em andamento\"}]}" --output grafico.png
```

Integração com frontend
- O frontend pode chamar `POST /grafico/data` para obter os números e montar um gráfico client-side, ou `POST /grafico/image` para receber a imagem pronta.
