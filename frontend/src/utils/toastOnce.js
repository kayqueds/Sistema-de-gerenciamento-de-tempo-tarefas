const shown = new Map();

/**
 * Executa a função de toast apenas uma vez por `ttl` milissegundos para a mesma chave.
 * Exemplo: toastOnce('erroSalvar', () => toast.error('Erro'))
 */
export default function toastOnce(key, fn, ttl = 1500) {
  const now = Date.now();
  const last = shown.get(key) || 0;
  if (now - last > ttl) {
    try {
      fn();
    } catch (e) {
      // não propagar exceção de toast
      // console.error('toastOnce erro:', e);
    }
    shown.set(key, now);
  }
}
