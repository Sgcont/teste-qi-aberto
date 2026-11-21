# QI Aberto / Open IQ Test

Teste de QI grátis, open source e privado. Roda 100% no navegador (HTML, CSS e JavaScript), com Python para servir localmente e verificar a privacidade.
Free, open source and private IQ test. Runs 100% in the browser, with Python to serve it locally and audit privacy.

**Idiomas / Languages:** 🇧🇷 PT | 🇺🇸 EN (botão no topo / button at the top)

## Segurança e privacidade / Security and privacy

Nível: **máximo por padrão: não existe back-end e não existe onde guardar dados.** O contador de usuários é um recurso **opcional, desligado por padrão** (veja abaixo).

1. Não há servidor que receba dados: o site é só arquivos estáticos.
2. A CSP em `index.html` usa `connect-src 'none'`, então o navegador **bloqueia qualquer envio pela rede** (com o contador desligado).
3. O código não usa cookies, `localStorage` nem formulários, e só o `contador.js` (opcional) pode usar rede. Prove você mesmo:
   ```
   python verificar_privacidade.py
   ```
4. Respostas e idioma ficam só na memória da aba e somem ao fechá-la.
5. `servidor.py` escuta apenas em `127.0.0.1`, não gera logs e recusa POST.

No back-end, no storage, no network. Everything lives in tab memory and disappears when you close it.

## Contador opcional / Optional counter

Mostra no rodapé a **média de QI** e o **total de pessoas que compartilharam**. Para respeitar a privacidade, funciona assim:

- **Desligado por padrão** (`URL_CONTADOR = ''` em `contador.js`): nada é enviado nem consultado.
- **Só conta quem clicar em "Compartilhar meu QI anonimamente".** Envia apenas o número do QI (sem nome, tempos ou respostas). Por isso o total é de "quem compartilhou", e não de visitas.
- O servidor (`contador/servidor_contador.py`) grava só dois números (total e soma), sem IP, horário ou logs.
- A CSP libera a rede somente para a URL do contador, e o `verificar_privacidade.py` confere tudo isso.
- Limite honesto: qualquer pessoa pode enviar valores falsos, então a média é uma curiosidade, não uma estatística confiável.
- Ao abrir a página, o navegador consulta `/stats`, e o servidor enxerga o IP de quem consulta (como em qualquer site), mas não o guarda.

**Para ativar:**
1. Hospede `contador/servidor_contador.py` (ex: Render ou PythonAnywhere). Defina `ORIGEM=https://SEU-USUARIO.github.io`. Teste local: `python contador/servidor_contador.py`.
2. Em `contador.js`, coloque a URL: `const URL_CONTADOR = 'https://seu-contador.onrender.com';`
3. Em `index.html`, troque `connect-src 'none'` pela mesma URL.
4. Rode `python verificar_privacidade.py` para conferir.

## Como rodar / How to run

```
python servidor.py
```
Abra / open `http://127.0.0.1:8000`. (Também funciona abrindo `index.html` direto.)

## Como o QI é estimado / How the IQ is estimated

São **30 questões** em 6 áreas (sequências, figuras, intruso, matemática, lógica e analogias), 5 por área, em dificuldade crescente (1 a 3).

- **Pontos:** acerto vale a dificuldade (1 a 3). Acerto em metade do tempo de referência ou menos ganha **+25%**. Demorar nunca tira pontos.
- **Conversão:** `QI = 100 + 15 * (p - 0,45) / 0,17`, onde `p` = pontos / máximo, limitado entre 55 e 145.
- **Margem de erro:** **±11 pontos (90% de confiança)**.
- **Gráfico final:** curva normal (média 100, desvio 15) com a sua faixa provável e os percentis correspondentes. Para usar outra média de referência, altere `cdf`/`percentil`/`grafico` em `app.js`.
- **Tempo:** medido só em memória (`performance.now`), nunca guardado.

A média (0,45), o desvio (0,17) e os tempos de referência são **suposições**, não vêm de amostra real. Para calibrar, aplique o teste a um grupo e ajuste `calcular()` no `app.js`.

**Aviso:** teste educativo, não clínico. / Educational, not a clinical instrument.

## Publicar no GitHub / Publish on GitHub

1. Crie o repositório `teste-qi-aberto` (público) em https://github.com/new
2. Suba os arquivos desta pasta.
3. Para ter o link do site: **Settings > Pages > Deploy from a branch > main / (root)**.
4. Seu site: `https://SEU-USUARIO.github.io/teste-qi-aberto/`
5. Seu código: `https://github.com/SEU-USUARIO/teste-qi-aberto`

## Licença / License

MIT (arquivo `LICENSE`).
