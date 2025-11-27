from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import matplotlib.pyplot as plt
import io
import requests
from datetime import datetime
import os


def _parse_date_to_date(dt):
    """Tenta normalizar uma string de data para um objeto date do Python.
    Suporta formatos: 'YYYY-MM-DD', 'YYYY-MM-DDTHH:MM:SS', 'DD/MM/YYYY'. Retorna None se falhar."""
    if not dt:
        return None
    if isinstance(dt, str):
        s = dt.split('T')[0]
        # tentar ISO YYYY-MM-DD
        try:
            return datetime.fromisoformat(s).date()
        except Exception:
            pass
        # tentar outros formatos
        for fmt in ("%d/%m/%Y", "%Y-%m-%d"):
            try:
                return datetime.strptime(s, fmt).date()
            except Exception:
                continue
    return None

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


def _fetch_tarefas_backend():
    """Busca a lista de tarefas no backend Node/Express.
    Retorna lista [] em caso de erro."""
    backend_url = os.environ.get('BACKEND_URL') or 'http://localhost:3000'
    try:
        res = requests.get(f'{backend_url.rstrip('/')}/tarefas', timeout=5)
        if res.ok:
            try:
                data = res.json()
                app.logger.info('Fetched %d tarefas from backend %s', len(data) if isinstance(data, list) else 0, backend_url)
                # log sample first item for debugging
                if isinstance(data, list) and len(data) > 0:
                    sample = data[0]
                    app.logger.debug('Sample tarefa keys: %s', list(sample.keys()))
                return data
            except Exception as e:
                app.logger.error('Erro ao decodificar JSON do backend: %s', e)
                return []
        app.logger.warning('Backend respondeu com status %s', res.status_code)
    except Exception as e:
        app.logger.error('Erro ao buscar tarefas no backend (%s): %s', backend_url, e)
    return []


@app.route('/chatbot', methods=['POST'])
def chatbot():
    body = request.get_json(force=True, silent=True) or {}
    msg = (body.get('mensagem') or '').lower()

    tarefas = _fetch_tarefas_backend()

    # intent: tarefas hoje
    if 'hoje' in msg and 'taref' in msg:
        today = datetime.now().date()
        qtd = 0
        for t in tarefas:
            dt = t.get('data_tarefa')
            if not dt:
                continue
            d = _parse_date_to_date(dt)
            if not d:
                continue
            if d == today:
                qtd += 1
        return jsonify({'resposta': f'Você tem {qtd} tarefas marcadas para hoje.'})

    # intent: total de tarefas
    if ('quantas' in msg and 'total' in msg) or 'no total' in msg or 'no sistema' in msg:
        total = len(tarefas)
        return jsonify({'resposta': f'Há {total} tarefas cadastradas no sistema.'})

    # intent: tarefas por prioridade
    # aceitar tanto frases com 'prioridade' quanto frases como 'tarefas altas'
    if (('prioridade' in msg) or ('taref' in msg) or ('tarefa' in msg) or ('tarefas' in msg)) and ('alta' in msg or 'normal' in msg or 'baixa' in msg):
        pr = 'Alta' if 'alta' in msg else 'Normal' if 'normal' in msg else 'Baixa'
        qtd = sum(
            1
            for t in tarefas
            if (t.get('prioridade') or '').lower() == pr.lower() or (t.get('status_tarefa') == 'concluida' and pr == 'Alta')
        )
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
            d = _parse_date_to_date(dt)
            if not d:
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
    # Em produção, use um servidor WSGI (gunicorn) e não o servidor de desenvolvimento
    debug = os.environ.get('FLASK_DEBUG', '1')
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5001)), debug=(debug == '1'))
