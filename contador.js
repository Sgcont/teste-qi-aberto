// Unico arquivo com acesso a rede. OPCIONAL: com a URL vazia, nada e enviado nem consultado.
// Para ativar, coloque a URL do seu servidor_contador.py abaixo e ajuste a CSP no index.html.
// Envia SOMENTE o numero do QI, e so quando a pessoa clica em compartilhar.
const URL_CONTADOR = '';

const Contador = {
  ativo: URL_CONTADOR !== '',
  async stats() {
    try { return await (await fetch(URL_CONTADOR + '/stats')).json(); } catch (e) { return null; }
  },
  async enviar(qi) {
    try {
      const r = await fetch(URL_CONTADOR + '/qi', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ qi }) });
      return r.ok ? await r.json() : null;
    } catch (e) { return null; }
  }
};
