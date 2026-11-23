# QI Aberto / Open IQ Test

Teste de QI grátis, open source e privado: 45 questões em 4 dimensões (verbal, lógico, numérico e abstrato). Roda no navegador (HTML, CSS e JavaScript), com Python para servir localmente, verificar a privacidade e, se você quiser, um contador opcional.
Free, open source and private IQ test: 45 questions in 4 dimensions. Runs in the browser, with Python to serve it locally, audit privacy and (optionally) count shared results.

**Idiomas / Languages:** 🇧🇷 PT | 🇺🇸 EN (botão no topo / button at the top)

## Arquivos / Files

| Arquivo | Função |
|---|---|
| `index.html`, `style.css`, `app.js` | O teste (questões, cronômetro, resultado e gráficos) |
| `contador.js` | Único arquivo com acesso à rede, opcional (começa desligado) |
| `contador/servidor_contador.py` | Servidor do contador opcional (Python, WSGI) |
| `servidor.py` | Servidor local para testar o site (sem logs) |
| `verificar_privacidade.py` | Prova no código de que nada é gravado nem enviado |

## Segurança e privacidade / Security and privacy

Nível: **máximo por padrão: não existe back-end e não existe onde guardar dados.** O contador de usuários é opcional e vem **desligado**.

1. O site é só arquivos estáticos: não há servidor que receba respostas.
2. A CSP em `index.html` usa `connect-src 'none'`, então o navegador **bloqueia qualquer envio pela rede** (com o contador desligado).
3. O código não usa cookies, `localStorage` nem formulários, e só o `contador.js` pode usar rede. Prove você mesmo:
   ```
   python verificar_privacidade.py
   ```
4. Respostas, tempos e idioma ficam só na memória da aba e somem ao fechá-la.
5. `servidor.py` escuta apenas em `127.0.0.1`, não gera logs e recusa POST.

## Como rodar / How to run

```
python servidor.py
```
Abra / open `http://127.0.0.1:8000`. (Também funciona abrindo `index.html` direto.)

## Como o QI é estimado / How the IQ is estimated

São **45 questões**: 11 verbais, 11 lógicas, 11 numéricas e 12 abstratas (sequências e figuras), em dificuldade crescente (1 a 4), intercaladas.

- **Pontos:** acerto vale a dificuldade (1 a 4). Acerto em metade do tempo de referência ou menos ganha **+25%**. Demorar nunca tira pontos.
- **Conversão:** `QI = 100 + 15 * (p - 0,42) / 0,17`, onde `p` = pontos / máximo, limitado entre 55 e 145.
- **Margem de erro:** **±10 pontos (90% de confiança)**.
- **Gráfico final:** curva normal (média 100, desvio 15, escala padrão de QI) com a sua faixa provável e os percentis.
- **Barras por dimensão:** % de pontos por categoria, ponderado pela dificuldade.
- **Tempo:** medido só em memória (`performance.now`), nunca guardado.

A média (0,42), o desvio (0,17), a margem e os tempos de referência são **suposições**, não vêm de amostra real. Para calibrar, aplique o teste a um grupo e ajuste `calcular()` no `app.js`.

**Aviso:** teste educativo, não clínico. / Educational, not a clinical instrument.

## Contador opcional / Optional counter

Mostra no rodapé a **média de QI** e o **total de pessoas que compartilharam**.

- **Desligado por padrão** (`URL_CONTADOR = ''` em `contador.js`): nada é enviado nem consultado.
- **Só conta quem clicar em "Compartilhar meu QI anonimamente".** Vai apenas o número do QI (sem nome, tempos ou respostas). Por isso o total é de "quem compartilhou", e não de visitas.
- O servidor grava só dois números (total e soma), sem IP, horário ou logs.
- A CSP libera a rede somente para a URL do contador, e o `verificar_privacidade.py` confere isso.
- Limite honesto: qualquer pessoa pode enviar valores falsos, então a média é uma curiosidade, não uma estatística confiável.
- Ao abrir a página, o navegador consulta `/stats`, e o servidor enxerga o IP de quem consulta (como em qualquer site), mas não o guarda.

### Onde hospedar o `URL_CONTADOR` (grátis)

O GitHub Pages só serve arquivos estáticos, então o servidor Python precisa de outro lugar. A opção recomendada é o **PythonAnywhere** (plano gratuito): roda apps Python WSGI, tem sistema de arquivos persistente (o contador não zera) e dá o endereço `SEU_USUARIO.pythonanywhere.com`. Passo a passo:

1. Crie uma conta gratuita em pythonanywhere.com.
2. Na aba **Files**, crie a pasta `teste-qi-aberto/contador` e envie o `servidor_contador.py` (ou use `git clone` do seu repositório no console Bash).
3. Na aba **Web**, clique em **Add a new web app**, escolha **Manual configuration** e a versão do Python.
4. Abra o arquivo WSGI da aba Web, apague o conteúdo e cole (ajuste usuário e site):
   ```python
   import os, sys
   caminho = '/home/SEU_USUARIO/teste-qi-aberto/contador'
   if caminho not in sys.path:
       sys.path.append(caminho)
   os.environ['ORIGEM'] = 'https://SEU-USUARIO.github.io'
   from servidor_contador import application
   ```
5. Clique em **Reload**. Teste abrindo `https://SEU_USUARIO.pythonanywhere.com/stats`: deve aparecer `{"total": 0, "media": null}`.
6. Em `contador.js`: `const URL_CONTADOR = 'https://SEU_USUARIO.pythonanywhere.com';`
7. Em `index.html`, troque `connect-src 'none'` por `connect-src https://SEU_USUARIO.pythonanywhere.com`.
8. Rode `python verificar_privacidade.py` e publique no GitHub.

Limites do plano gratuito (página oficial de recursos do PythonAnywhere): 1 web app, 1 worker, 100 segundos de CPU por dia e **validade de 1 mês**, então é preciso entrar na aba Web de tempos em tempos para estender, ou o app é desativado. Para um contador minúsculo isso basta. Os menus podem mudar, então confira a ajuda do PythonAnywhere se algo estiver diferente.

**Por que não o Render grátis?** Segundo a documentação do Render, serviços gratuitos têm sistema de arquivos efêmero (apagado a cada reinício, redeploy ou quando o serviço dorme após 15 minutos sem tráfego), então o contador voltaria a zero.

## Publicar no GitHub / Publish on GitHub

1. Crie o repositório `teste-qi-aberto` (público) em https://github.com/new
2. Suba os arquivos desta pasta (o `.gitignore` já evita subir `contador.json`).
3. Para ter o link do site: **Settings > Pages > Deploy from a branch > main / (root)**.
4. Seu site: `https://SEU-USUARIO.github.io/teste-qi-aberto/`
5. Seu código: `https://github.com/SEU-USUARIO/teste-qi-aberto`

## Licença / License

MIT (arquivo `LICENSE`).
