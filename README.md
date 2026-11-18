# QI Aberto / Open IQ Test

Teste de QI grátis, open source e privado. Roda 100% no navegador (HTML, CSS e JavaScript), com Python para servir localmente e verificar a privacidade.
Free, open source and private IQ test. Runs 100% in the browser, with Python to serve it locally and audit privacy.

**Idiomas / Languages:** 🇧🇷 PT | 🇺🇸 EN (botão no topo / button at the top)

## Segurança e privacidade / Security and privacy

Nível: **máximo para um app web, porque não existe back-end e não existe onde guardar dados.**

1. Não há servidor que receba dados: o site é só arquivos estáticos.
2. A CSP em `index.html` usa `connect-src 'none'`, então o navegador **bloqueia qualquer envio pela rede**.
3. O código não usa cookies, `localStorage`, `fetch` nem formulários. Prove você mesmo:
   ```
   python verificar_privacidade.py
   ```
4. Respostas e idioma ficam só na memória da aba e somem ao fechá-la.
5. `servidor.py` escuta apenas em `127.0.0.1`, não gera logs e recusa POST.

No back-end, no storage, no network. Everything lives in tab memory and disappears when you close it.

## Como rodar / How to run

```
python servidor.py
```
Abra / open `http://127.0.0.1:8000`. (Também funciona abrindo `index.html` direto.)

## Como o QI é estimado / How the IQ is estimated

São 11 questões de dificuldade crescente. A conversão é `QI = 100 + 15 * (acertos - 5,5) / 2`, limitada entre 55 e 145, com margem de **±16 pontos (90% de confiança)**, compatível com um teste curto e de confiabilidade moderada. A média (5,5) e o desvio (2) são **suposições**, não vêm de uma amostra real. Para calibrar, rode o teste com um grupo e ajuste a fórmula em `calcularQI()` no `app.js`.

**Aviso:** teste educativo, não clínico. / Educational, not a clinical instrument.

## Publicar no GitHub / Publish on GitHub

1. Crie o repositório `teste-qi-aberto` (público) em https://github.com/new
2. Suba os arquivos desta pasta.
3. Para ter o link do site: **Settings > Pages > Deploy from a branch > main / (root)**.
4. Seu site: `https://SEU-USUARIO.github.io/teste-qi-aberto/`
5. Seu código: `https://github.com/SEU-USUARIO/teste-qi-aberto`

## Licença / License

MIT (arquivo `LICENSE`).
