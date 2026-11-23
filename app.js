// QI Aberto v3: tudo roda no navegador. Nada e gravado; nada e enviado sem a escolha da pessoa.
// (confira com: python verificar_privacidade.py)

const L = (pt, en) => ({ pt, en });
// O('Baixo|Short', 'Grande|Big') cria opcoes bilingues; sem '|' o texto vale para os dois idiomas
const O = (...s) => s.map(x => { const [p, e = p] = x.split('|'); return L(p, e); });
const NS = L('Não dá para saber', 'Cannot be determined');
const INK = '#161a33', BRAND = '#4f46e5';

const TX = {
  pt: {
    marca: 'QI Aberto',
    eyebrow: 'teste de qi online',
    h1: 'Meça seu raciocínio em cerca de 30 minutos',
    sub: '4 dimensões cognitivas, 45 questões e dificuldade crescente. Seu tempo de resposta também conta, mas nada do que você responde é gravado.',
    chips: '4 dimensões · 45 questões · dificuldade crescente · resultado imediato',
    iniciar: 'Começar o teste', q: 'Questão', de: 'de',
    perfil: 'Perfil cognitivo', exemplo: 'exemplo ilustrativo',
    como: 'Como funciona',
    passos: [['Responda 45 questões', 'Múltipla escolha, com dificuldade crescente. Acertos rápidos valem bônus.'],
             ['Veja seu QI estimado', 'Valor na escala padrão, com margem de erro e sua posição na curva normal.'],
             ['Entenda seu perfil', 'Gráfico por dimensão, ritmo de resposta e pontos fortes.']],
    faqT: 'Perguntas frequentes',
    faq: [['O resultado é confiável?', 'É uma estimativa educativa. Um teste curto, sem calibração com amostra real, não substitui avaliação com psicólogo.'],
          ['Meus dados são guardados?', 'Não. Tudo roda no navegador e some ao fechar a página. Compartilhar o QI é opcional e só existe se o site tiver o contador ativado.'],
          ['Posso refazer?', 'Quantas vezes quiser. A ordem das alternativas muda a cada tentativa.']],
    seq: 'Qual número completa a sequência?',
    fig: 'Qual figura vem a seguir?',
    estranho: 'Qual item não pertence ao grupo?',
    analogia: 'Complete a analogia:',
    antonimo: 'Qual palavra é o oposto de:',
    resultado: 'Seu QI estimado', acertos: 'Acertos',
    margem: 'Margem de erro (90% de confiança): entre', e: 'e',
    faixas: ['abaixo da média', 'média baixa', 'média', 'acima da média', 'muito acima da média'],
    forte: (a, b) => `Ponto mais forte: ${a}. Mais espaço para treinar: ${b}.`,
    curva: 'Onde você está na curva de referência',
    ref: 'Curva normal: média 100, desvio padrão 15 (escala padrão de QI)',
    aqui: 'Você está aqui',
    faixa: (a, b, pa, pb) => `Sua faixa provável vai de QI ${a} a ${b}: entre o percentil ${pa} e o ${pb}, ou seja, à frente de ${pa}% a ${pb}% da população de referência.`,
    veloc: 'Seu ritmo', tmedio: 'Tempo médio por questão', rapidas: 'Acertos rápidos',
    genio2: '🧠 Respondeu rápido e acertou questões difíceis: ritmo de gênio!',
    genio1: '⚡ Uma questão difícil acertada em tempo recorde. Bom sinal!',
    notaTempo: 'Acerto em metade do tempo de referência ou menos ganha bônus. Demorar nunca tira pontos.',
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
    eyebrow: 'online iq test',
    h1: 'Measure your reasoning in about 30 minutes',
    sub: '4 cognitive dimensions, 45 questions and rising difficulty. Your response time counts too, but nothing you answer is stored.',
    chips: '4 dimensions · 45 questions · rising difficulty · instant result',
    iniciar: 'Start the test', q: 'Question', de: 'of',
    perfil: 'Cognitive profile', exemplo: 'illustrative example',
    como: 'How it works',
    passos: [['Answer 45 questions', 'Multiple choice, with rising difficulty. Fast correct answers earn a bonus.'],
             ['See your estimated IQ', 'A value on the standard scale, with margin of error and your place on the normal curve.'],
             ['Understand your profile', 'A chart per dimension, your answering pace and your strengths.']],
    faqT: 'Frequently asked questions',
    faq: [['Is the result reliable?', 'It is an educational estimate. A short test, not calibrated on a real sample, is no substitute for a professional assessment.'],
          ['Is my data stored?', 'No. Everything runs in your browser and disappears when you close the page. Sharing your IQ is optional and only exists if the site enables the counter.'],
          ['Can I retake it?', 'As many times as you like. The order of the options changes on every attempt.']],
    seq: 'Which number completes the sequence?',
    fig: 'Which shape comes next?',
    estranho: 'Which item does not belong to the group?',
    analogia: 'Complete the analogy:',
    antonimo: 'Which word is the opposite of:',
    resultado: 'Your estimated IQ', acertos: 'Correct answers',
    margem: 'Margin of error (90% confidence): between', e: 'and',
    faixas: ['below average', 'low average', 'average', 'above average', 'well above average'],
    forte: (a, b) => `Strongest area: ${a}. Most room to train: ${b}.`,
    curva: 'Where you stand on the reference curve',
    ref: 'Normal curve: mean 100, standard deviation 15 (standard IQ scale)',
    aqui: 'You are here',
    faixa: (a, b, pa, pb) => `Your likely range goes from IQ ${a} to ${b}: between percentile ${pa} and ${pb}, meaning ahead of ${pa}% to ${pb}% of the reference population.`,
    veloc: 'Your pace', tmedio: 'Average time per question', rapidas: 'Fast correct answers',
    genio2: '🧠 Fast answers on hard questions: genius pace!',
    genio1: '⚡ One hard question solved in record time. Good sign!',
    notaTempo: 'A correct answer in half the reference time or less earns a bonus. Taking longer never costs points.',
    aviso: 'Educational, not clinical, and not a substitute for a professional assessment.',
    priv: 'Nothing was stored. Close the page and everything is gone (except the IQ number, if you shared it).',
    refazer: 'Retake the test',
    cMedia: 'Average IQ of those who shared', cTotal: 'People who shared their result',
    cInfo: 'Optional: sends only the IQ number (no name, timings or answers; the server stores no IP) for the site average.',
    cEnviar: 'Share my IQ anonymously', cObrigado: 'Thanks! Your IQ is now part of the site average.', cErro: 'Could not send. Try again',
    rodape: 'Open source (MIT license). Nothing is sent without your choice.'
  }
};

const CATS = { v: L('Verbal', 'Verbal'), l: L('Lógico', 'Logical'), n: L('Numérico', 'Numerical'), a: L('Abstrato', 'Abstract') };
const TREF = { 1: 20, 2: 35, 3: 55, 4: 75 }; // tempo de referencia (s) por dificuldade

// ---------- figuras (SVG gerado aqui, sem imagens externas) ----------
const svg = c => `<svg width="76" height="76" viewBox="-38 -38 76 76" xmlns="http://www.w3.org/2000/svg">${c}</svg>`;
const seta = r => svg(`<polygon points="0,-24 14,4 5,4 5,24 -5,24 -5,4 -14,4" fill="${INK}" transform="rotate(${r})"/>`);
const poli = a => { // a = numero de lados ou [lados, cheio(1/0)]
  const [n, cheio = 1] = [].concat(a);
  const pts = [...Array(n)].map((_, k) => {
    const ang = 2 * Math.PI * k / n - Math.PI / 2;
    return (26 * Math.cos(ang)).toFixed(1) + ',' + (26 * Math.sin(ang)).toFixed(1);
  }).join(' ');
  return svg(`<polygon points="${pts}" fill="${cheio ? BRAND : 'none'}" stroke="${BRAND}" stroke-width="3"/>`);
};
const pontos = n => svg([...Array(n)].map((_, k) =>
  `<circle cx="${(k % 3 - 1) * 20}" cy="${(Math.floor(k / 3) - 1) * 20}" r="6" fill="${INK}"/>`).join(''));
const quad = k => svg([[-28, -28], [2, -28], [2, 2], [-28, 2]].map(([x, y], j) => {
  const on = j === k % 4 || j === (k + 1) % 4; // dois quadrantes vizinhos preenchidos
  return `<rect x="${x}" y="${y}" width="26" height="26" fill="${on ? BRAND : 'none'}" stroke="${BRAND}" stroke-width="2"/>`;
}).join(''));

// ---------- banco de questões ----------
// mk(categoria, dificuldade 1-4, enunciado, cena, opcoes): a PRIMEIRA opção é a certa (embaralhadas ao iniciar)
const mk = (area, d, enun, cena, ops) => ({ area, d, enun, cena, ops: ops.map((h, k) => ({ h, ok: k === 0 })) });
const vis = (area, d, fn, seq, ops) => mk(area, d, 'fig', seq.map(fn).join('') + '<b>?</b>', ops.map(fn));

const V = [ // verbal (11)
  mk('v', 1, 'analogia', L('Quente : Frio :: Alto : ?', 'Hot : Cold :: Tall : ?'), O('Baixo|Short', 'Grande|Big', 'Magro|Thin', 'Rápido|Fast')),
  mk('v', 1, 'estranho', L('Cachorro, Gato, Cavalo, Mesa, Vaca', 'Dog, Cat, Horse, Table, Cow'), O('Mesa|Table', 'Gato|Cat', 'Vaca|Cow', 'Cavalo|Horse')),
  mk('v', 2, 'analogia', L('Pássaro : Ninho :: Abelha : ?', 'Bird : Nest :: Bee : ?'), O('Colmeia|Hive', 'Mel|Honey', 'Flor|Flower', 'Zangão|Drone')),
  mk('v', 2, 'analogia', L('Termômetro : Temperatura :: Régua : ?', 'Thermometer : Temperature :: Ruler : ?'), O('Comprimento|Length', 'Madeira|Wood', 'Escola|School', 'Número|Number')),
  mk('v', 2, 'estranho', L('Quadrado, Triângulo, Círculo, Cubo, Retângulo', 'Square, Triangle, Circle, Cube, Rectangle'), O('Cubo|Cube', 'Círculo|Circle', 'Triângulo|Triangle', 'Quadrado|Square')),
  mk('v', 3, 'analogia', L('Eco : Som :: Reflexo : ?', 'Echo : Sound :: Reflection : ?'), O('Luz|Light', 'Espelho|Mirror', 'Imagem|Image', 'Água|Water')),
  mk('v', 3, 'estranho', L('Violino, Violoncelo, Harpa, Flauta, Violão', 'Violin, Cello, Harp, Flute, Guitar'), O('Flauta|Flute', 'Harpa|Harp', 'Violão|Guitar', 'Violino|Violin')),
  mk('v', 3, 'antonimo', L('Escasso', 'Scarce'), O('Abundante|Abundant', 'Raro|Rare', 'Pequeno|Small', 'Barato|Cheap')),
  mk('v', 4, 'analogia', L('Cético : Dúvida :: Otimista : ?', 'Skeptic : Doubt :: Optimist : ?'), O('Esperança|Hope', 'Tristeza|Sadness', 'Certeza|Certainty', 'Medo|Fear')),
  mk('v', 4, 'estranho', L('Cobre, Ferro, Ouro, Latão, Prata', 'Copper, Iron, Gold, Brass, Silver'), O('Latão|Brass', 'Cobre|Copper', 'Ouro|Gold', 'Prata|Silver')),
  mk('v', 4, 'analogia', L('Partitura : Música :: Planta baixa : ?', 'Sheet music : Song :: Blueprint : ?'), O('Edifício|Building', 'Papel|Paper', 'Arquiteto|Architect', 'Régua|Ruler'))
];

const LG = [ // lógico (11)
  mk('l', 1, L('Todos os gatos são animais. Mimi é um gato. Logo, Mimi é...', 'All cats are animals. Mimi is a cat. So Mimi is...'), '', [...O('um animal|an animal', 'uma planta|a plant', 'um cachorro|a dog'), NS]),
  mk('l', 1, L('Ana é mais alta que Bia. Bia é mais alta que Carla. Quem é a mais baixa?', 'Ana is taller than Bia. Bia is taller than Carla. Who is the shortest?'), '', ['Carla', 'Ana', 'Bia', NS]),
  mk('l', 2, L('Se chove, a rua fica molhada. A rua está molhada. Podemos concluir que choveu?', 'If it rains, the street gets wet. The street is wet. Can we conclude it rained?'), '',
    O('Não necessariamente|Not necessarily', 'Sim, com certeza|Yes, for sure', 'Não, é impossível|No, it is impossible', 'Depende da cidade|It depends on the city')),
  mk('l', 2, L('Na fila, Pedro está à frente de Lia, Lia à frente de Davi e Davi à frente de Rui. Quem está em 3º lugar?', 'In a line, Pedro is ahead of Lia, Lia ahead of Davi, and Davi ahead of Rui. Who is 3rd?'), '', ['Davi', 'Lia', 'Rui', 'Pedro']),
  mk('l', 2, L('Maria é mais velha que João, João é mais velho que Paulo, e Paulo é mais velho que Rita. Quem é o segundo mais velho?', 'Maria is older than João, João is older than Paulo, and Paulo is older than Rita. Who is the second oldest?'), '', ['João', 'Maria', 'Paulo', 'Rita']),
  mk('l', 3, L('Nenhum A é B. Alguns C são A. Logo:', 'No A is B. Some C are A. Therefore:'), '',
    O('Alguns C não são B|Some C are not B', 'Todo C é B|Every C is B', 'Nenhum C é A|No C is A', 'Alguns C são B|Some C are B')),
  mk('l', 3, L('Todos os A são B. Alguns B são C. Logo:', 'All A are B. Some B are C. Therefore:'), '',
    O('Não se pode concluir que algum A é C|We cannot conclude that any A is C', 'Alguns A são C|Some A are C', 'Todo A é C|Every A is C', 'Nenhum A é C|No A is C')),
  mk('l', 3, L('Ana, Bruno e Carla vestem camisetas de cores diferentes: vermelha, azul e verde. Ana não veste vermelho nem azul. Bruno não veste vermelho. Quem veste vermelho?', 'Ana, Bruno and Carla wear shirts of different colors: red, blue and green. Ana wears neither red nor blue. Bruno does not wear red. Who wears red?'), '', ['Carla', 'Ana', 'Bruno', NS]),
  mk('l', 4, L('Se A, então B. Se B, então C. Sabemos que C é falso. O que podemos concluir?', 'If A then B. If B then C. We know C is false. What can we conclude?'), '',
    O('A é falso|A is false', 'A é verdadeiro|A is true', 'B é verdadeiro|B is true', 'Nada pode ser concluído|Nothing can be concluded')),
  mk('l', 4, L('Todos os membros do clube A são do clube B. Nenhum membro do clube B é do clube C. Maria é do clube A. Maria pode ser do clube C?', 'Every member of club A is in club B. No member of club B is in club C. Maria is in club A. Can Maria be in club C?'), '',
    [...O('Não|No', 'Sim|Yes', 'Somente se sair do clube A|Only if she leaves club A'), NS]),
  mk('l', 4, L('Se 5 máquinas fazem 5 peças em 5 minutos, quantos minutos 100 máquinas levam para fazer 100 peças?', 'If 5 machines make 5 parts in 5 minutes, how many minutes do 100 machines need to make 100 parts?'), '', [5, 100, 20, 1])
];

const N = [ // numérico (11)
  mk('n', 1, L('Se 3 canetas custam 6, quanto custam 5 canetas?', 'If 3 pens cost 6, how much do 5 pens cost?'), '', [10, 12, 9, 15]),
  mk('n', 1, L('Quanto é 25% de 80?', 'What is 25% of 80?'), '', [20, 25, 16, 40]),
  mk('n', 2, L('Um trem anda 60 km em 45 minutos. Quantos km ele anda em 1h30, na mesma velocidade?', 'A train covers 60 km in 45 minutes. How many km in 1h30 at the same speed?'), '', [120, 90, 100, 135]),
  mk('n', 2, L('A soma de dois números é 20 e a diferença é 6. Qual é o maior?', 'Two numbers add up to 20 and differ by 6. What is the larger one?'), '', [13, 14, 10, 7]),
  mk('n', 2, L('Um produto de 80 tem 25% de desconto e, depois, mais 10% sobre o preço já com desconto. Qual o preço final?', 'A product priced at 80 gets 25% off, then 10% more off the already discounted price. What is the final price?'), '', [54, 52, 56, 48]),
  mk('n', 3, L('João tem o dobro da idade de Ana. Daqui a 10 anos, a soma das idades dos dois será 50. Qual é a idade atual de Ana?', 'John is twice as old as Ana. In 10 years, their ages will add up to 50. How old is Ana now?'), '', [10, 12, 8, 15]),
  mk('n', 3, L('Uma torneira enche um tanque em 6 horas e outra, em 3 horas. Abertas juntas, em quanto tempo enchem o tanque?', 'One tap fills a tank in 6 hours and another in 3 hours. Opened together, how long do they take to fill it?'), '', O('2 h', '4,5 h|4.5 h', '3 h', '1 h')),
  mk('n', 3, L('A média de 4 números é 12. Ao incluir um quinto número, a média passa a ser 14. Qual é o quinto número?', 'The average of 4 numbers is 12. After adding a fifth number, the average becomes 14. What is the fifth number?'), '', [22, 14, 26, 20]),
  mk('n', 4, L('Quantos números de 2 algarismos são divisíveis por 7?', 'How many 2-digit numbers are divisible by 7?'), '', [13, 12, 14, 15]),
  mk('n', 4, L('Um valor cresce 10% ao ano (juros compostos). Quantos anos inteiros são necessários, no mínimo, para ele dobrar?', 'A sum grows 10% a year (compound interest). What is the minimum number of whole years for it to at least double?'), '', [8, 7, 10, 9]),
  mk('n', 4, L('A chance de chover hoje é 30% e a de chover amanhã é 50%, de forma independente. Qual a chance de NÃO chover em nenhum dos dois dias?', 'The chance of rain today is 30% and tomorrow is 50%, independently. What is the chance of NO rain on either day?'), '', ['35%', '20%', '15%', '80%'])
];

const A = [ // abstrato (12): sequências e figuras
  mk('a', 1, 'seq', '2, 4, 6, 8, ?', [10, 12, 9, 14]),
  vis('a', 1, seta, [0, 90, 180], [270, 225, 315, 90]),
  mk('a', 2, 'seq', '1, 1, 2, 3, 5, 8, ?', [13, 11, 12, 16]),
  vis('a', 2, poli, [3, 4, 5], [6, 8, 4, 7]),
  vis('a', 2, pontos, [1, 3, 5], [7, 6, 8, 9]),
  mk('a', 3, 'seq', '5, 10, 9, 18, 17, ?', [34, 16, 33, 35]),
  vis('a', 3, quad, [0, 1, 2], [3, 0, 1, 2]),
  mk('a', 3, 'seq', '2, 3, 5, 9, 17, ?', [33, 31, 34, 25]),
  vis('a', 3, poli, [[3, 1], [4, 0], [5, 1]], [[6, 0], [6, 1], [7, 0], [5, 0]]),
  mk('a', 4, 'seq', '1, 2, 6, 24, 120, ?', [720, 240, 600, 360]),
  mk('a', 4, 'seq', '2, 3, 4, 6, 8, 12, 16, ?', [24, 18, 20, 32]),
  vis('a', 4, seta, [0, 45, 135, 270], [90, 180, 45, 315])
];

// dificuldade crescente, intercalando as 4 dimensoes (sort e estavel)
const BANCO = [V, LG, N, A].flatMap(cat => cat.map((q, pos) => ({ ...q, pos }))).sort((x, y) => x.d - y.d || x.pos - y.pos);

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

// Pontos: acerto vale a dificuldade (1 a 4); acerto rapido vale +25%.
// Conversao: QI = 100 + 15 * (p - 0,42) / 0,17, onde p = pontos / maximo. Media 0,42 e desvio 0,17 sao SUPOSICOES.
// Margem de 10 pontos = 90% de confianca com erro padrao ~6 (confiabilidade ~0,84).
function calcular() {
  let w = 0, wmax = 0;
  for (const r of regs) { wmax += r.d * 1.25; if (r.ok) w += r.d * (r.rapida ? 1.25 : 1); }
  return Math.max(55, Math.min(145, Math.round(100 + 15 * (w / wmax - 0.42) / 0.17)));
}

// % por dimensao, ponderado pela dificuldade (sem bonus de velocidade)
function porCategoria() {
  const pct = {};
  for (const c of Object.keys(CATS)) {
    const rs = regs.filter(r => r.area === c);
    pct[c] = Math.round(100 * rs.reduce((s, r) => s + (r.ok ? r.d : 0), 0) / rs.reduce((s, r) => s + r.d, 0));
  }
  return pct;
}

const barras = pct => Object.keys(CATS).map(c =>
  `<div class="cat"><div class="linha"><span>${pick(CATS[c])}</span><b>${pct[c]}%</b></div><div class="trilha"><i data-w="${pct[c]}"></i></div></div>`).join('');

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
    `<line x1="${sx(v)}" y1="150" x2="${sx(v)}" y2="155" stroke="#6b7390"/>` +
    `<text x="${sx(v)}" y="170" font-size="12" text-anchor="middle" fill="#6b7390">${v}</text>`).join('');
  const mx = Math.max(70, Math.min(530, sx(qi)));
  return `<svg viewBox="0 0 600 235" width="100%" role="img" aria-label="${t.curva}">
    <polygon points="${faixa}" fill="${BRAND}" fill-opacity=".3"/>
    <polyline points="${curva}" fill="none" stroke="${INK}" stroke-width="2.5"/>
    <line x1="20" y1="150" x2="580" y2="150" stroke="${INK}"/>${ticks}
    <line x1="${sx(qi)}" y1="${sy(qi)}" x2="${sx(qi)}" y2="150" stroke="${BRAND}" stroke-width="3"/>
    <rect x="${sx(lo)}" y="184" width="${sx(hi) - sx(lo)}" height="12" rx="6" fill="${BRAND}" fill-opacity=".3"/>
    <circle cx="${sx(qi)}" cy="190" r="8" fill="${BRAND}"/>
    <text x="${mx}" y="222" text-anchor="middle" font-size="15" font-weight="700" fill="${INK}">${t.aqui}</text>
  </svg>`;
}

// ---------- contador opcional (so existe se contador.js tiver URL) ----------
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
  document.title = t.marca + ' | ' + t.eyebrow;
  pintarStats();
  for (const b of document.querySelectorAll('nav button')) b.classList.toggle('ativo', b.dataset.lang === lang);

  if (i < 0) {
    el.innerHTML = `
      <span class="eyebrow">${t.eyebrow}</span>
      <h1>${t.h1}</h1><p class="sub">${t.sub}</p>
      <button class="principal" id="ini">${t.iniciar}</button>
      <p class="suave chips">${t.chips}</p>
      <div class="caixa"><div class="linha"><strong>${t.perfil}</strong><span class="suave">${t.exemplo}</span></div>
        <div class="qi pequeno">112 <span class="chip">${t.faixas[2]}</span></div>${barras({ v: 70, l: 78, n: 64, a: 81 })}</div>
      <h2>${t.como}</h2>
      <div class="passos">${t.passos.map((p, k) => `<div class="caixa"><span class="num">0${k + 1}</span><strong>${p[0]}</strong><p class="suave">${p[1]}</p></div>`).join('')}</div>
      <h2>${t.faqT}</h2>
      ${t.faq.map(f => `<details class="caixa"><summary>${f[0]}</summary><p class="suave">${f[1]}</p></details>`).join('')}`;
    document.getElementById('ini').onclick = iniciar;
  } else if (i < Q.length) {
    const q = Q[i], enun = t[q.enun] || pick(q.enun);
    el.innerHTML = `
      <div class="linha"><span class="suave">${t.q} ${i + 1} ${t.de} ${Q.length}</span><span class="cron" id="cron">0s</span></div>
      <div class="progresso"><i id="prog"></i></div>
      <p class="enun"><strong>${enun}</strong></p>
      ${q.cena ? `<div class="caixa cena">${pick(q.cena)}</div>` : ''}
      <div class="ops">${q.ops.map((o, k) => `<button class="op" data-k="${k}">${pick(o.h)}</button>`).join('')}</div>`;
    document.getElementById('prog').style.width = (i / Q.length * 100) + '%';
    const cron = document.getElementById('cron');
    const marcar = () => { cron.textContent = Math.floor((performance.now() - t0) / 1000) + 's'; };
    marcar(); timer = setInterval(marcar, 500);
    for (const b of el.querySelectorAll('.op')) b.onclick = () => responder(+b.dataset.k);
  } else {
    const qi = calcular(), lo = Math.max(40, qi - 10), hi = Math.min(160, qi + 10);
    const faixa = qi < 70 ? 0 : qi < 85 ? 1 : qi < 115 ? 2 : qi < 130 ? 3 : 4;
    const acertos = regs.filter(r => r.ok).length;
    const rapidas = regs.filter(r => r.rapida).length;
    const genios = regs.filter(r => r.d >= 3 && r.rapida).length;
    const tmedio = (regs.reduce((s, r) => s + r.seg, 0) / regs.length).toFixed(1);
    const pct = porCategoria(), cs = Object.keys(CATS);
    const forte = cs.reduce((a, b) => pct[b] > pct[a] ? b : a), fraco = cs.reduce((a, b) => pct[b] < pct[a] ? b : a);
    el.innerHTML = `
      <span class="eyebrow">${t.resultado}</span>
      <div class="qi">${qi} <span class="chip">${t.faixas[faixa]}</span></div>
      <p>${t.margem} <strong>${lo}</strong> ${t.e} <strong>${hi}</strong></p>
      <p class="suave">${t.acertos}: ${acertos}/${Q.length}</p>
      <div class="caixa"><strong>${t.perfil}</strong>${barras(pct)}<p class="suave">${t.forte(pick(CATS[forte]), pick(CATS[fraco]))}</p></div>
      <div class="caixa"><strong>${t.curva}</strong>${grafico(qi, lo, hi, t)}
        <p>${t.faixa(lo, hi, percentil(lo), percentil(hi))}</p><p class="suave">${t.ref}</p></div>
      <div class="caixa"><strong>${t.veloc}</strong>
        <p>${t.tmedio}: <b>${tmedio}s</b> | ${t.rapidas}: <b>${rapidas}</b></p>
        ${genios >= 2 ? `<p>${t.genio2}</p>` : genios === 1 ? `<p>${t.genio1}</p>` : ''}
        <p class="suave">${t.notaTempo}</p></div>
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
  for (const b of el.querySelectorAll('[data-w]')) b.style.width = b.dataset.w + '%'; // barras por dimensao
}

for (const b of document.querySelectorAll('nav button'))
  b.onclick = () => { lang = b.dataset.lang; desenhar(); };

desenhar();
carregarStats();
