from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import matplotlib.pyplot as plt
import io
import requests
from datetime import datetime

app = Flask(__name__)
CORS(app)


def map_priority(t):
    # recebe uma tarefa (dict) e retorna 'Alta'|'Normal'|'Baixa' ou 'Outros'
    p = t.get('prioridade')
    if p:
        return p
    status = t.get('status_tarefa', '')
    if status == 'concluida':
        return 'Alta'
    if status == 'em andamento':
        return 'Normal'
    return 'Baixa'


@app.route('/grafico/data', methods=['POST'])
def grafico_data():
    """Recebe JSON com {"tarefas": [ ... ]} e retorna contagem por prioridade."""
    body = request.get_json(force=True, silent=True) or {}
    tarefas = body.get('tarefas', [])
    counts = {'Alta': 0, 'Normal': 0, 'Baixa': 0, 'Outros': 0}
    for t in tarefas:
        try:
            pr = map_priority(t)
            if pr in counts:
                counts[pr] += 1
            else:
                counts['Outros'] += 1
        except Exception:
            counts['Outros'] += 1
    return jsonify({
        'labels': list(counts.keys()),
        'values': [counts[k] for k in counts.keys()],
        'counts': counts,
    })


@app.route('/grafico/image', methods=['POST'])
def grafico_image():
    """Gera um PNG do gráfico (pie) a partir das mesmas tarefas enviadas."""
    body = request.get_json(force=True, silent=True) or {}
    tarefas = body.get('tarefas', [])
    # Reusar a lógica de contagem
    counts = {'Alta': 0, 'Normal': 0, 'Baixa': 0, 'Outros': 0}
    for t in tarefas:
        try:
            pr = map_priority(t)
            if pr in counts:
                counts[pr] += 1
            else:
                counts['Outros'] += 1
        except Exception:
            counts['Outros'] += 1

    labels = list(counts.keys())
    values = [counts[k] for k in labels]

    # Criar figura
    fig, ax = plt.subplots(figsize=(4, 4))
    colors = ['#ef4444', '#f59e0b', '#10b981', '#9ca3af']
    wedges, texts, autotexts = ax.pie(values, labels=labels, autopct='%1.1f%%', colors=colors)
    ax.set_title('Distribuição por Prioridade')
    plt.tight_layout()

    buf = io.BytesIO()
    fig.savefig(buf, format='png', dpi=100)
    plt.close(fig)
    buf.seek(0)
    return send_file(buf, mimetype='image/png')


@app.route('/grafico/sample', methods=['GET'])
def grafico_sample():
    """Endpoint de amostra que demonstra uso com dados estáticos."""
    sample = {
        'tarefas': [
            {'nome_tarefa': 'A', 'prioridade': 'Alta'},
            {'nome_tarefa': 'B', 'prioridade': 'Normal'},
            {'nome_tarefa': 'C', 'prioridade': 'Baixa'},
            {'nome_tarefa': 'D', 'status_tarefa': 'concluida'},
        ]
    }
    return jsonify(sample)


# 🚫 REMOVIDA: A função _fetch_tarefas_backend() foi removida.
# Ela causava erro em produção ao tentar acessar 'http://localhost:3000'.
# A lista de tarefas agora é obtida diretamente do JSON da requisição.


@app.route('/chatbot', methods=['POST'])
def chatbot():
    body = request.get_json(force=True, silent=True) or {}
    msg = (body.get('mensagem') or '').lower()
    
    # ⭐️ CORREÇÃO 1: Pega as tarefas diretamente do corpo da requisição POST
    # O frontend (React) é quem busca e envia a lista completa.
    tarefas = body.get('tarefas', []) 
    
    # Adicionando uma checagem para dar uma resposta mais útil
    if not tarefas:
        return jsonify({'resposta': 'Não consegui acessar sua lista de tarefas. Certifique-se de que sua lista está carregada.'})

    # intent: tarefas hoje
    if 'hoje' in msg and 'taref' in msg:
        today = datetime.now().date()
        qtd = 0
        for t in tarefas:
            dt = t.get('data_tarefa')
            if not dt:
                continue
            try:
                d = datetime.fromisoformat(dt).date()
            except Exception:
                # se estiver no formato dd/mm/yyyy
                try:
                    d = datetime.strptime(dt, '%d/%m/%Y').date()
                except Exception:
                    continue
            if d == today:
                qtd += 1
        return jsonify({'resposta': f'Você tem {qtd} tarefas marcadas para hoje.'})

    # intent: total de tarefas
    if 'quantas' in msg and 'total' in msg or 'no total' in msg or 'no sistema' in msg:
        total = len(tarefas)
        return jsonify({'resposta': f'Há {total} tarefas cadastradas no sistema.'})

    # intent: tarefas por prioridade
    if 'prioridade' in msg and ('alta' in msg or 'normal' in msg or 'baixa' in msg):
        pr = 'Alta' if 'alta' in msg else 'Normal' if 'normal' in msg else 'Baixa'
        qtd = sum(1 for t in tarefas if (t.get('prioridade') or '').lower() == pr.lower() or (t.get('status_tarefa') == 'concluida' and pr == 'Alta'))
        return jsonify({'resposta': f'Você possui {qtd} tarefas de prioridade {pr.lower()}.'})

    # intent: listar pendentes
    if 'pendente' in msg or 'pendentes' in msg or 'liste' in msg or 'listar' in msg:
        pendentes = [ (t.get('nome_tarefa') or t.get('titulo') or '') for t in tarefas if (t.get('status_tarefa') or '').lower() in ('pendente','pendentes') or (t.get('status_tarefa') or '').strip()=='' ]
        if not pendentes:
            return jsonify({'resposta': 'Não há tarefas pendentes.'})
        short = pendentes[:10]
        return jsonify({'resposta': f'Aqui estão suas tarefas pendentes: {", ".join(short)}'})

    # intent: atrasadas
    if 'atras' in msg or 'atrasadas' in msg or 'atrasado' in msg:
        atrasadas = []
        today = datetime.now().date()
        for t in tarefas:
            dt = t.get('data_tarefa')
            status = (t.get('status_tarefa') or '').lower()
            if not dt:
                continue
            try:
                d = datetime.fromisoformat(dt).date()
            except Exception:
                try:
                    d = datetime.strptime(dt, '%d/%m/%Y').date()
                except Exception:
                    continue
            if d < today and status != 'concluida':
                atrasadas.append(t.get('nome_tarefa') or t.get('titulo') or '')
        if not atrasadas:
            return jsonify({'resposta': 'Não há tarefas atrasadas.'})
        return jsonify({'resposta': f'Sim, você tem {len(atrasadas)} tarefas atrasadas: {", ".join(atrasadas[:10])}.'})

    # intent: ajuda
    if 'o que' in msg or 'ajuda' in msg or 'com que' in msg:
        texto = 'Posso te ajudar com:\n\n- Quantidade de tarefas\n- Listar tarefas\n- Ver prioridades\n- Ver tarefas do dia\n- Ver tarefas atrasadas'
        return jsonify({'resposta': texto})

    return jsonify({'resposta': 'Não entendi. Tente perguntar: tarefas de hoje, tarefas altas, pendentes, atrasadas, ou "o que você pode fazer".'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)