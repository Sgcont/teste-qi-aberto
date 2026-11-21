"""Verificador de privacidade do QI Aberto.

Procura no codigo qualquer recurso que permita gravar ou enviar dados.
Regras:
  1. Nenhum cookie, armazenamento local, formulario ou recurso externo.
  2. Acesso a rede (fetch) SOMENTE em contador.js, que e opcional.
  3. contador.js so pode enviar o numero do QI: JSON.stringify({ qi }).
  4. A CSP do index.html precisa bloquear a rede ('none') ou liberar
     somente a URL do contador, e nada alem disso.
Se algo falhar, mostra o arquivo e a linha e sai com erro (codigo 1).

Uso:  python verificar_privacidade.py
"""
import re
import sys
from pathlib import Path

PASTA = Path(__file__).parent
ARQUIVOS = ["index.html", "app.js", "style.css", "contador.js"]

# (regex, motivo, permitido_em_contador_js)
PROIBIDOS = [
    (r"\bfetch\s*\(", "requisicao de rede (fetch)", True),
    (r"XMLHttpRequest", "requisicao de rede (XHR)", False),
    (r"sendBeacon", "envio de dados (sendBeacon)", False),
    (r"WebSocket|EventSource", "conexao de rede aberta", False),
    (r"localStorage|sessionStorage|indexedDB", "armazenamento no navegador", False),
    (r"document\.cookie", "cookies", False),
    (r"<form\b", "formulario (envio de dados)", False),
    (r"(src|href)\s*=\s*[\"']https?://", "recurso externo carregado de outro site", False),
    (r"@import|url\(\s*[\"']?https?:", "CSS carregando recurso externo", False),
    (r"import\s*\(", "import dinamico", False),
]


def sem_comentarios(texto):
    texto = re.sub(r"<!--.*?-->", "", texto, flags=re.S)  # comentarios HTML
    texto = re.sub(r"/\*.*?\*/", "", texto, flags=re.S)  # comentarios de bloco
    return re.sub(r"(?m)//.*$", "", texto)  # comentarios de linha


problemas = []
for nome in ARQUIVOS:
    bruto = (PASTA / nome).read_text(encoding="utf-8")
    for n, linha in enumerate(sem_comentarios(bruto).splitlines(), 1):
        for padrao, motivo, so_contador in PROIBIDOS:
            if re.search(padrao, linha) and not (so_contador and nome == "contador.js"):
                problemas.append(f"{nome}:{n}  {motivo}")

# regra 3: o contador so envia o QI
contador = (PASTA / "contador.js").read_text(encoding="utf-8")
limpo = sem_comentarios(contador)
if len(re.findall(r"\bfetch\s*\(", limpo)) != 2:
    problemas.append("contador.js  deve ter exatamente 2 chamadas de rede (stats e enviar)")
for corpo in re.findall(r"JSON\.stringify\(([^)]*)\)", limpo):
    if corpo.strip() != "{ qi }":
        problemas.append(f"contador.js  envia algo alem do QI: {corpo.strip()}")

# regra 4: a CSP precisa bater com a URL do contador
m = re.search(r"URL_CONTADOR\s*=\s*'([^']*)'", contador)
url = m.group(1).rstrip("/") if m else None
meta = re.search(r'Content-Security-Policy"\s+content="([^"]*)"', (PASTA / "index.html").read_text(encoding="utf-8"))
csp = re.search(r"connect-src ([^;]*)", meta.group(1)) if meta else None
csp = csp.group(1).strip().rstrip("/") if csp else None
esperado = "'none'" if url == "" else url
if url is None:
    problemas.append("contador.js  falta a constante URL_CONTADOR")
elif csp != esperado:
    problemas.append(f"index.html  connect-src deveria ser {esperado} mas e {csp}")

if problemas:
    print("FALHOU:")
    print("\n".join(problemas))
    sys.exit(1)
modo = "contador DESLIGADO, rede bloqueada" if url == "" else f"contador ligado, rede liberada so para {url}"
print(f"OK ({modo}): nada e gravado e so o numero do QI pode ser enviado.")
