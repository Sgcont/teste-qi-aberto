// QI Aberto v2: tudo roda no navegador. Nada e gravado, nada e enviado.
// (sem cookies, sem armazenamento local, sem rede; confira com: python verificar_privacidade.py)

const L = (pt, en) => ({ pt, en });
const NS = L('Não dá para saber', 'Cannot be determined');

const TX = {
  pt: {
    marca: 'QI Aberto',
    titulo: 'Teste de QI grátis, aberto e privado',
    intro: '30 questões de lógica em 6 áreas (sequências, figuras, intruso, matemática, lógica e analogias), cerca de 25 minutos. Seu tempo de resposta também conta: acertos rápidos valem bônus. Nada é gravado, e nada é enviado sem a sua escolha.',
    iniciar: 'Começar', q: 'Questão', de: 'de',
    seq: 'Qual número completa a sequência?',
    fig: 'Qual figura vem a seguir?',
    estranho: 'Qual item não pertence ao grupo?',
    analogia: 'Complete a analogia:',
    resultado: 'Seu QI estimado', acertos: 'Acertos',
    margem: 'Margem de erro (90% de confiança): entre', e: 'e',
    faixas: ['abaixo da média', 'média baixa', 'média', 'acima da média', 'muito acima da média'],
    curva: 'Onde você está na curva de referência',
    ref: 'Curva normal: média 100, desvio padrão 15 (escala padrão de QI)',
    aqui: 'Você está aqui',
    faixa: (a, b, pa, pb) => `Sua faixa provável vai de QI ${a} a ${b}: entre o percentil ${pa} e o ${pb}, ou seja, à frente de ${pa}% a ${pb}% da população de referência.`,
    veloc: 'Seu ritmo', tmedio: 'Tempo médio por questão', rapidas: 'Acertos rápidos',
    genio2: '🧠 Respondeu rápido e acertou questões difíceis: ritmo de gênio!',
    genio1: '⚡ Uma questão difícil acertada em tempo recorde. Bom sinal!',
    notaTempo: 'Acerto em metade do tempo de referência ou menos ganha bônus. Demorar nunca tira pontos.',
    areas: 'Acertos por área',
    aviso: 'Teste educativo, não clínico, e não substitui avaliação com psicólogo.',
    priv: 'Nada foi gravado. Ao fechar a página, tudo desaparece (exceto o número do QI, se você o compartilhou).',
    refazer: 'Refazer o teste',
    cMedia: 'Média de QI de quem compartilhou', cTotal: 'Pessoas que compartilharam o resultado',
    cInfo: 'Opcional: envia só o número do QI (sem nome, tempos ou respostas; o servidor não guarda IP) para a média do site.',
    cEnviar: 'Compartilhar meu QI anonimamente', cObrigado: 'Obrigado! Seu QI entrou na média do site.', cErro: 'Não foi possível enviar. Tentar de novo',
    rodape: 'Código aberto (licença MIT). Nada é enviado sem a sua escolha.'
  },
  en: {
    marca: 'Open IQ',
    titulo: 'Free, open and private IQ test',
    intro: '30 logic questions in 6 areas (sequences, shapes, odd one out, math, logic and analogies), about 25 minutes. Your response time counts too: fast correct answers earn a bonus. Nothing is stored, and nothing is sent without your choice.',
    iniciar: 'Start', q: 'Question', de: 'of',
    seq: 'Which number completes the sequence?',
    fig: 'Which shape comes next?',
    estranho: 'Which item does not belong to the group?',
    analogia: 'Complete the analogy:',
    resultado: 'Your estimated IQ', acertos: 'Correct answers',
    margem: 'Margin of error (90% confidence): between', e: 'and',
    faixas: ['below average', 'low average', 'average', 'above average', 'well above average'],
    curva: 'Where you stand on the reference curve',
    ref: 'Normal curve: mean 100, standard deviation 15 (standard IQ scale)',
    aqui: 'You are here',
    faixa: (a, b, pa, pb) => `Your likely range goes from IQ ${a} to ${b}: between percentile ${pa} and ${pb}, meaning ahead of ${pa}% to ${pb}% of the reference population.`,
    veloc: 'Your pace', tmedio: 'Average time per question', rapidas: 'Fast correct answers',
    genio2: '🧠 Fast answers on hard questions: genius pace!',
    genio1: '⚡ One hard question solved in record time. Good sign!',
    notaTempo: 'A correct answer in half the reference time or less earns a bonus. Taking longer never costs points.',
    areas: 'Correct answers by area',
    aviso: 'Educational, not clinical, and not a substitute for a professional assessment.',
    priv: 'Nothing was stored. Close the page and everything is gone (except the IQ number, if you shared it).',
    refazer: 'Retake the test',
    cMedia: 'Average IQ of those who shared', cTotal: 'People who shared their result',
    cInfo: 'Optional: sends only the IQ number (no name, timings or answers; the server stores no IP) for the site average.',
    cEnviar: 'Share my IQ anonymously', cObrigado: 'Thanks! Your IQ is now part of the site average.', cErro: 'Could not send. Try again',
    rodape: 'Open source (MIT license). Nothing is sent without your choice.'
  }
};

const AREAS = {
  s: L('Sequências', 'Sequences'), f: L('Figuras', 'Shapes'), i: L('Intruso', 'Odd one out'),
  m: L('Matemática', 'Math'), l: L('Lógica', 'Logic'), a: L('Analogias', 'Analogies')
};
const TREF = { 1: 20, 2: 35, 3: 55 }; // tempo de referencia (s) por dificuldade

// ---------- figuras (SVG gerado aqui, sem imagens externas) ----------
const svg = c => `<svg width="76" height="76" viewBox="-38 -38 76 76" xmlns="http://www.w3.org/2000/svg">${c}</svg>`;
const seta = r => svg(`<polygon points="0,-24 14,4 5,4 5,24 -5,24 -5,4 -14,4" fill="#14213d" transform="rotate(${r})"/>`);
const poli = a => { // a = numero de lados ou [lados, cheio(1/0)]
  const [n, cheio = 1] = [].concat(a);
  const pts = [...Array(n)].map((_, k) => {
    const ang = 2 * Math.PI * k / n - Math.PI / 2;
    return (26 * Math.cos(ang)).toFixed(1) + ',' + (26 * Math.sin(ang)).toFixed(1);
  }).join(' ');
  return svg(`<polygon points="${pts}" fill="${cheio ? '#2b50aa' : 'none'}" stroke="#2b50aa" stroke-width="3"/>`);
};
const pontos = n => svg([...Array(n)].map((_, k) =>
  `<circle cx="${(k % 3 - 1) * 20}" cy="${(Math.floor(k / 3) - 1) * 20}" r="6" fill="#14213d"/>`).join(''));
const quad = k => svg([[-28, -28], [2, -28], [2, 2], [-28, 2]].map(([x, y], j) => {
  const on = j === k % 4 || j === (k + 1) % 4; // dois quadrantes vizinhos preenchidos
  return `<rect x="${x}" y="${y}" width="26" height="26" fill="${on ? '#2b50aa' : 'none'}" stroke="#2b50aa" stroke-width="2"/>`;
}).join(''));

// ---------- banco de questões ----------
// mk(area, dificuldade, enunciado, cena, opcoes): a PRIMEIRA opção é a certa (embaralhadas ao iniciar)
const mk = (area, d, enun, cena, ops) => ({ area, d, enun, cena, ops: ops.map((h, k) => ({ h, ok: k === 0 })) });
const vis = (area, d, fn, seq, ops) => mk(area, d, 'fig', seq.map(fn).join('') + '<b>?</b>', ops.map(fn));

const BANCO = [
  // rodada 1 (dificuldade 1)
  mk('s', 1, 'seq', '2, 4, 6, 8, ?', [10, 12, 9, 14]),
  vis('f', 1, seta, [0, 90, 180], [270, 225, 315, 90]),
  mk('i', 1, 'estranho', '4, 9, 16, 25, 30', [30, 9, 16, 25]),
  mk('m', 1, L('Se 3 canetas custam 6, quanto custam 5 canetas?', 'If 3 pens cost 6, how much do 5 pens cost?'), '', [10, 12, 9, 15]),
  mk('l', 1, L('Todos os gatos são animais. Mimi é um gato. Logo, Mimi é...', 'All cats are animals. Mimi is a cat. So Mimi is...'), '',
    [L('um animal', 'an animal'), L('uma planta', 'a plant'), L('um cachorro', 'a dog'), NS]),
  mk('a', 1, 'analogia', L('Quente : Frio :: Alto : ?', 'Hot : Cold :: Tall : ?'), [L('Baixo', 'Short'), L('Grande', 'Big'), L('Magro', 'Thin'), L('Rápido', 'Fast')]),
  // rodada 2 (dificuldade 1)
  mk('s', 1, 'seq', '3, 6, 12, 24, ?', [48, 36, 30, 42]),
  vis('f', 1, poli, [3, 4, 5], [6, 8, 4, 7]),
  mk('i', 1, 'estranho', L('Cachorro, Gato, Cavalo, Mesa, Vaca', 'Dog, Cat, Horse, Table, Cow'), [L('Mesa', 'Table'), L('Gato', 'Cat'), L('Vaca', 'Cow'), L('Cavalo', 'Horse')]),
  mk('m', 1, L('Quanto é 25% de 80?', 'What is 25% of 80?'), '', [20, 25, 16, 40]),
  mk('l', 1, L('Ana é mais alta que Bia. Bia é mais alta que Carla. Quem é a mais baixa?', 'Ana is taller than Bia. Bia is taller than Carla. Who is the shortest?'), '', ['Carla', 'Ana', 'Bia', NS]),
  mk('a', 1, 'analogia', L('Pé : Meia :: Mão : ?', 'Foot : Sock :: Hand : ?'), [L('Luva', 'Glove'), L('Anel', 'Ring'), L('Braço', 'Arm'), L('Dedo', 'Finger')]),
  // rodada 3 (dificuldade 2)
  mk('s', 2, 'seq', '1, 1, 2, 3, 5, 8, ?', [13, 11, 12, 16]),
  vis('f', 2, pontos, [1, 3, 5], [7, 6, 8, 9]),
  mk('i', 2, 'estranho', '2, 3, 5, 7, 9, 11', [9, 3, 7, 11]),
  mk('m', 2, L('Um trem anda 60 km em 45 minutos. Quantos km ele anda em 1h30, na mesma velocidade?', 'A train covers 60 km in 45 minutes. How many km in 1h30 at the same speed?'), '', [120, 90, 100, 135]),
  mk('l', 2, L('Se chove, a rua fica molhada. A rua está molhada. Podemos concluir que choveu?', 'If it rains, the street gets wet. The street is wet. Can we conclude it rained?'), '',
    [L('Não necessariamente', 'Not necessarily'), L('Sim, com certeza', 'Yes, for sure'), L('Não, é impossível', 'No, it is impossible'), L('Depende da cidade', 'It depends on the city')]),
  mk('a', 2, 'analogia', L('Pássaro : Ninho :: Abelha : ?', 'Bird : Nest :: Bee : ?'), [L('Colmeia', 'Hive'), L('Mel', 'Honey'), L('Flor', 'Flower'), L('Zangão', 'Drone')]),
  // rodada 4 (dificuldade 2)
  mk('s', 2, 'seq', '5, 10, 9, 18, 17, ?', [34, 16, 33, 35]),
  vis('f', 2, quad, [0, 1, 2], [3, 0, 1, 2]),
  mk('i', 2, 'estranho', L('Quadrado, Triângulo, Círculo, Cubo, Retângulo', 'Square, Triangle, Circle, Cube, Rectangle'), [L('Cubo', 'Cube'), L('Círculo', 'Circle'), L('Triângulo', 'Triangle'), L('Quadrado', 'Square')]),
  mk('m', 2, L('A soma de dois números é 20 e a diferença é 6. Qual é o maior?', 'Two numbers add up to 20 and differ by 6. What is the larger one?'), '', [13, 14, 10, 7]),
  mk('l', 2, L('Na fila, Pedro está à frente de Lia, Lia à frente de Davi e Davi à frente de Rui. Quem está em 3º lugar?', 'In a line, Pedro is ahead of Lia, Lia ahead of Davi, and Davi ahead of Rui. Who is 3rd?'), '', ['Davi', 'Lia', 'Rui', 'Pedro']),
  mk('a', 2, 'analogia', L('Primeiro : Último :: Início : ?', 'First : Last :: Beginning : ?'), [L('Fim', 'End'), L('Meio', 'Middle'), L('Começo', 'Start'), L('Cedo', 'Early')]),
  // rodada 5 (dificuldade 3)
  mk('s', 3, 'seq', '2, 3, 5, 9, 17, ?', [33, 31, 34, 25]),
  vis('f', 3, poli, [[3, 1], [4, 0], [5, 1]], [[6, 0], [6, 1], [7, 0], [5, 0]]),
  mk('i', 3, 'estranho', '8, 27, 64, 100, 125', [100, 27, 64, 125]),
  mk('m', 3, L('João tem o dobro da idade de Ana. Daqui a 10 anos, a soma das idades dos dois será 50. Qual é a idade atual de Ana?', 'John is twice as old as Ana. In 10 years, their ages will add up to 50. How old is Ana now?'), '', [10, 12, 8, 15]),
  mk('l', 3, L('Nenhum A é B. Alguns C são A. Logo:', 'No A is B. Some C are A. Therefore:'), '',
    [L('Alguns C não são B', 'Some C are not B'), L('Todo C é B', 'Every C is B'), L('Nenhum C é A', 'No C is A'), L('Alguns C são B', 'Some C are B')]),
  mk('a', 3, 'analogia', L('Eco : Som :: Reflexo : ?', 'Echo : Sound :: Reflection : ?'), [L('Luz', 'Light'), L('Espelho', 'Mirror'), L('Imagem', 'Image'), L('Água', 'Water')])
];

// ---------- estado (apenas em memória, some ao fechar a aba) ----------
let lang = navigator.language && navigator.language.startsWith('en') ? 'en' : 'pt';
let Q = [], regs = [], i = -1, t0 = 0, timer = null, statsGlobal = null, enviado = false;

const pick = v => (v && v.pt !== undefined ? v[lang] : v);
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
  regs = []; i = 0; enviado = false; t0 = performance.now();
  desenhar();
}

function responder(k) {
  const q = Q[i], seg = (performance.now() - t0) / 1000, ok = q.ops[k].ok;
  regs.push({ area: q.area, d: q.d, ok, seg, rapida: ok && seg <= TREF[q.d] / 2 });
  i++; t0 = performance.now();
  desenhar();
}

// Pontos: acerto vale a dificuldade (1 a 3); acerto rapido vale +25%.
// Conversao: QI = 100 + 15 * (p - 0,45) / 0,17, onde p = pontos / maximo. Media 0,45 e desvio 0,17 sao SUPOSICOES.
// Margem de 11 pontos = 90% de confianca com erro padrao ~6,7 (confiabilidade ~0,8).
function calcular() {
  let w = 0, wmax = 0;
  for (const r of regs) { wmax += r.d * 1.25; if (r.ok) w += r.d * (r.rapida ? 1.25 : 1); }
  return Math.max(55, Math.min(145, Math.round(100 + 15 * (w / wmax - 0.45) / 0.17)));
}

// distribuicao normal acumulada (aproximacao de Abramowitz e Stegun)
const cdf = z => {
  const t = 1 / (1 + 0.2316419 * Math.abs(z)), d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
};
const percentil = v => Math.round(cdf((v - 100) / 15) * 100);

function grafico(qi, lo, hi, t) {
  const sx = v => 20 + (v - 40) / 120 * 560;
  const pdf = v => Math.exp(-((v - 100) ** 2) / 450);
  const sy = v => 150 - pdf(v) * 110;
  let curva = '', faixa = `${sx(lo).toFixed(1)},150 `;
  for (let v = 40; v <= 160; v += 2) curva += `${sx(v).toFixed(1)},${sy(v).toFixed(1)} `;
  for (let v = lo; v <= hi; v++) faixa += `${sx(v).toFixed(1)},${sy(v).toFixed(1)} `;
  faixa += `${sx(hi).toFixed(1)},150`;
  const ticks = [55, 70, 85, 100, 115, 130, 145].map(v =>
    `<line x1="${sx(v)}" y1="150" x2="${sx(v)}" y2="155" stroke="#5b6b82"/>` +
    `<text x="${sx(v)}" y="170" font-size="12" text-anchor="middle" fill="#5b6b82">${v}</text>`).join('');
  const mx = Math.max(70, Math.min(530, sx(qi)));
  return `<svg viewBox="0 0 600 235" width="100%" role="img" aria-label="${t.curva}">
    <polygon points="${faixa}" fill="#2b50aa" fill-opacity=".35"/>
    <polyline points="${curva}" fill="none" stroke="#14213d" stroke-width="2.5"/>
    <line x1="20" y1="150" x2="580" y2="150" stroke="#14213d"/>${ticks}
    <line x1="${sx(qi)}" y1="${sy(qi)}" x2="${sx(qi)}" y2="150" stroke="#2b50aa" stroke-width="3"/>
    <rect x="${sx(lo)}" y="184" width="${sx(hi) - sx(lo)}" height="12" rx="6" fill="#2b50aa" fill-opacity=".35"/>
    <circle cx="${sx(qi)}" cy="190" r="8" fill="#2b50aa"/>
    <text x="${mx}" y="222" text-anchor="middle" font-size="15" font-weight="700" fill="#14213d">${t.aqui}</text>
  </svg>`;
}

function pintarStats() {
  const t = TX[lang], g = statsGlobal;
  document.getElementById('stats').innerHTML = Contador.ativo && g
    ? `<div class="stats"><div><b>${g.media === null ? '-' : g.media}</b><span>${t.cMedia}</span></div><div><b>${g.total}</b><span>${t.cTotal}</span></div></div>` : '';
}
async function carregarStats() {
  if (!Contador.ativo) return;
  statsGlobal = await Contador.stats();
  pintarStats();
}

function desenhar() {
  const t = TX[lang], el = document.getElementById('tela');
  clearInterval(timer);
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  document.getElementById('marca').textContent = t.marca;
  document.getElementById('rodape').textContent = t.rodape;
  document.title = t.marca + ' | ' + t.titulo;
  pintarStats();
  for (const b of document.querySelectorAll('nav button')) b.classList.toggle('ativo', b.dataset.lang === lang);

  if (i < 0) {
    el.innerHTML = `<h1>${t.titulo}</h1><p>${t.intro}</p><button class="principal" id="ini">${t.iniciar}</button>`;
    document.getElementById('ini').onclick = iniciar;
  } else if (i < Q.length) {
    const q = Q[i], enun = t[q.enun] || pick(q.enun);
    el.innerHTML = `
      <div class="linha"><span class="suave">${t.q} ${i + 1} ${t.de} ${Q.length}</span><span class="cron" id="cron">0s</span></div>
      <div class="barra"><i id="prog"></i></div>
      <p><strong>${enun}</strong></p>
      ${q.cena ? `<div class="caixa cena">${pick(q.cena)}</div>` : ''}
      <div class="ops">${q.ops.map((o, k) => `<button class="op" data-k="${k}">${pick(o.h)}</button>`).join('')}</div>`;
    document.getElementById('prog').style.width = (i / Q.length * 100) + '%';
    const cron = document.getElementById('cron');
    const marcar = () => { cron.textContent = Math.floor((performance.now() - t0) / 1000) + 's'; };
    marcar(); timer = setInterval(marcar, 500);
    for (const b of el.querySelectorAll('.op')) b.onclick = () => responder(+b.dataset.k);
  } else {
    const qi = calcular(), lo = Math.max(40, qi - 11), hi = Math.min(160, qi + 11);
    const faixa = qi < 70 ? 0 : qi < 85 ? 1 : qi < 115 ? 2 : qi < 130 ? 3 : 4;
    const acertos = regs.filter(r => r.ok).length;
    const rapidas = regs.filter(r => r.rapida).length;
    const genios = regs.filter(r => r.d === 3 && r.rapida).length;
    const tmedio = (regs.reduce((s, r) => s + r.seg, 0) / regs.length).toFixed(1);
    const porArea = Object.keys(AREAS).map(a => {
      const rs = regs.filter(r => r.area === a);
      return `<span>${pick(AREAS[a])}: <b>${rs.filter(r => r.ok).length}/${rs.length}</b></span>`;
    }).join('');
    el.innerHTML = `
      <p class="suave">${t.resultado}</p>
      <div class="qi">${qi}</div>
      <p>${t.margem} <strong>${lo}</strong> ${t.e} <strong>${hi}</strong> (${t.faixas[faixa]})</p>
      <p class="suave">${t.acertos}: ${acertos}/${Q.length}</p>
      <div class="caixa"><strong>${t.curva}</strong>${grafico(qi, lo, hi, t)}
        <p>${t.faixa(lo, hi, percentil(lo), percentil(hi))}</p><p class="suave">${t.ref}</p></div>
      <div class="caixa"><strong>${t.veloc}</strong>
        <p>${t.tmedio}: <b>${tmedio}s</b> | ${t.rapidas}: <b>${rapidas}</b></p>
        ${genios >= 2 ? `<p>${t.genio2}</p>` : genios === 1 ? `<p>${t.genio1}</p>` : ''}
        <p class="suave">${t.notaTempo}</p></div>
      <div class="caixa"><strong>${t.areas}</strong><div class="areas">${porArea}</div></div>
      ${Contador.ativo ? (enviado ? `<div class="caixa"><p>${t.cObrigado}</p></div>`
        : `<div class="caixa"><p class="suave">${t.cInfo}</p><button class="principal" id="env">${t.cEnviar}</button></div>`) : ''}
      <div class="caixa"><p class="suave">${t.aviso}</p><p class="suave">${t.priv}</p></div>
      <button class="principal" id="ref">${t.refazer}</button>`;
    document.getElementById('ref').onclick = () => { i = -1; desenhar(); };
    const env = document.getElementById('env');
    if (env) env.onclick = async () => {
      env.disabled = true;
      const r = await Contador.enviar(qi); // unico envio: o numero do QI
      if (r) { statsGlobal = r; enviado = true; desenhar(); }
      else { env.disabled = false; env.textContent = t.cErro; }
    };
  }
}

for (const b of document.querySelectorAll('nav button'))
  b.onclick = () => { lang = b.dataset.lang; desenhar(); };

desenhar();
carregarStats();
