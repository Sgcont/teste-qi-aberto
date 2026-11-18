// QI Aberto: tudo roda no navegador. Nada e gravado, nada e enviado.
// (sem cookies, sem localStorage, sem fetch; confira com: python verificar_privacidade.py)

const TX = {
  pt: {
    marca: 'QI Aberto',
    titulo: 'Teste de QI grátis, aberto e privado',
    intro: '11 questões de lógica com números e figuras, cerca de 10 minutos. Nenhum dado é gravado ou enviado: o código está aberto para você conferir.',
    iniciar: 'Começar', q: 'Questão', de: 'de',
    seq: 'Qual número completa a sequência?',
    fig: 'Qual figura vem a seguir?',
    estranho: 'Qual número não segue a regra do grupo?',
    regra: 'Descubra a regra (entrada → saída) e complete:',
    resultado: 'Seu QI estimado', acertos: 'Acertos',
    margem: 'Margem de erro (90% de confiança): entre',
    e: 'e',
    faixas: ['abaixo da média', 'média baixa', 'média', 'acima da média', 'muito acima da média'],
    aviso: 'Teste curto e educativo. Não é um instrumento clínico e não substitui avaliação com psicólogo.',
    priv: 'Nenhum dado foi gravado ou enviado. Ao fechar a página, tudo desaparece.',
    refazer: 'Refazer o teste',
    rodape: 'Código aberto (licença MIT). Sem coleta de dados.'
  },
  en: {
    marca: 'Open IQ',
    titulo: 'Free, open and private IQ test',
    intro: '11 logic questions with numbers and shapes, about 10 minutes. No data is stored or sent anywhere: the code is open so you can check it.',
    iniciar: 'Start', q: 'Question', de: 'of',
    seq: 'Which number completes the sequence?',
    fig: 'Which shape comes next?',
    estranho: 'Which number breaks the group rule?',
    regra: 'Find the rule (input → output) and complete it:',
    resultado: 'Your estimated IQ', acertos: 'Correct answers',
    margem: 'Margin of error (90% confidence): between',
    e: 'and',
    faixas: ['below average', 'low average', 'average', 'above average', 'well above average'],
    aviso: 'Short educational test. Not a clinical instrument and not a substitute for a professional assessment.',
    priv: 'Nothing was stored or sent. Close the page and everything is gone.',
    refazer: 'Retake the test',
    rodape: 'Open source (MIT license). No data collection.'
  }
};

// ---------- figuras (SVG gerado aqui, sem imagens externas) ----------
const svg = c => `<svg width="76" height="76" viewBox="-38 -38 76 76" xmlns="http://www.w3.org/2000/svg">${c}</svg>`;
const seta = r => svg(`<polygon points="0,-24 14,4 5,4 5,24 -5,24 -5,4 -14,4" fill="#14213d" transform="rotate(${r})"/>`);
const poli = n => svg(`<polygon points="${[...Array(n)].map((_, k) => {
  const a = 2 * Math.PI * k / n - Math.PI / 2;
  return (26 * Math.cos(a)).toFixed(1) + ',' + (26 * Math.sin(a)).toFixed(1);
}).join(' ')}" fill="#2b50aa"/>`);
const pontos = n => svg([...Array(n)].map((_, k) =>
  `<circle cx="${(k % 3 - 1) * 20}" cy="${(Math.floor(k / 3) - 1) * 20}" r="6" fill="#14213d"/>`).join(''));

// ---------- banco de questões (o 3o argumento e a resposta certa; as opções são embaralhadas ao iniciar) ----------
const num = (enun, texto, r, ops) => ({ enun, cena: texto, ops: ops.map(o => ({ h: String(o), ok: o === r })) });
const vis = (fn, seq, r, ops) => ({
  enun: 'fig',
  cena: seq.map(fn).join('') + '<b>?</b>',
  ops: ops.map(o => ({ h: fn(o), ok: o === r }))
});

const BANCO = [
  num('seq', '2, 4, 6, 8, ?', 10, [10, 12, 9, 14]),
  num('seq', '2, 4, 8, 16, ?', 32, [32, 30, 24, 34]),
  num('seq', '1, 4, 9, 16, ?', 25, [25, 20, 24, 36]),
  vis(seta, [0, 90, 180], 270, [270, 225, 315, 90]),
  num('seq', '3, 6, 11, 18, ?', 27, [27, 26, 30, 25]),
  vis(poli, [3, 4, 5], 6, [6, 8, 4, 7]),
  num('seq', '1, 1, 2, 3, 5, 8, ?', 13, [13, 11, 12, 16]),
  num('seq', '5, 10, 9, 18, 17, ?', 34, [34, 16, 33, 35]),
  vis(pontos, [1, 3, 5], 7, [7, 6, 8, 9]),
  num('estranho', '4, 9, 16, 25, 30', 30, [30, 9, 16, 25]),
  num('regra', '2 → 5, 3 → 10, 4 → 17, 5 → ?', 26, [26, 22, 25, 24])
];

// ---------- estado (apenas em memória, some ao fechar a aba) ----------
let lang = navigator.language && navigator.language.startsWith('en') ? 'en' : 'pt';
let Q = [], i = -1, acertos = 0;

const embaralhar = a => {
  a = a.slice();
  for (let k = a.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [a[k], a[j]] = [a[j], a[k]]; // troca as duas posicoes
  }
  return a;
};

function iniciar() {
  Q = BANCO.map(q => ({ ...q, ops: embaralhar(q.ops) }));
  i = 0; acertos = 0;
  desenhar();
}

function responder(k) {
  if (Q[i].ops[k].ok) acertos++;
  i++;
  desenhar();
}

// QI estimado: assume media de 5,5 acertos e desvio de 2 (ver README).
// Margem de 16 pontos = intervalo de 90% com erro padrao de ~9,5 (confiabilidade ~0,6).
function calcularQI() {
  const qi = Math.round(100 + 15 * (acertos - 5.5) / 2);
  return Math.max(55, Math.min(145, qi));
}

function desenhar() {
  const t = TX[lang], el = document.getElementById('tela');
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  document.getElementById('marca').textContent = t.marca;
  document.getElementById('rodape').textContent = t.rodape;
  document.title = t.marca + ' | ' + t.titulo;
  for (const b of document.querySelectorAll('nav button'))
    b.classList.toggle('ativo', b.dataset.lang === lang);

  if (i < 0) {
    el.innerHTML = `<h1>${t.titulo}</h1><p>${t.intro}</p><button class="principal" id="ini">${t.iniciar}</button>`;
    document.getElementById('ini').onclick = iniciar;
  } else if (i < Q.length) {
    const q = Q[i];
    el.innerHTML = `
      <p class="suave">${t.q} ${i + 1} ${t.de} ${Q.length}</p>
      <div class="barra"><i id="prog"></i></div>
      <p><strong>${t[q.enun]}</strong></p>
      <div class="caixa cena">${q.cena}</div>
      <div class="ops">${q.ops.map((o, k) => `<button class="op" data-k="${k}">${o.h}</button>`).join('')}</div>`;
    document.getElementById('prog').style.width = (i / Q.length * 100) + '%';
    for (const b of el.querySelectorAll('.op')) b.onclick = () => responder(+b.dataset.k);
  } else {
    const qi = calcularQI();
    const faixa = qi < 70 ? 0 : qi < 85 ? 1 : qi < 115 ? 2 : qi < 130 ? 3 : 4;
    el.innerHTML = `
      <p class="suave">${t.resultado}</p>
      <div class="qi">${qi}</div>
      <p>${t.margem} <strong>${qi - 16}</strong> ${t.e} <strong>${qi + 16}</strong> (${t.faixas[faixa]})</p>
      <p class="suave">${t.acertos}: ${acertos}/${Q.length}</p>
      <div class="caixa"><p class="suave">${t.aviso}</p><p class="suave">${t.priv}</p></div>
      <button class="principal" id="ref">${t.refazer}</button>`;
    document.getElementById('ref').onclick = () => { i = -1; desenhar(); };
  }
}

for (const b of document.querySelectorAll('nav button'))
  b.onclick = () => { lang = b.dataset.lang; desenhar(); };

desenhar();
