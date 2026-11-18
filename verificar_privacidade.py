"""Verificador de privacidade do QI Aberto.

Procura no codigo qualquer recurso que permita gravar ou enviar dados.
Se encontrar algo, mostra o arquivo e a linha e sai com erro (codigo 1).

Uso:  python verificar_privacidade.py
"""
import re
import sys
from pathlib import Path

PASTA = Path(__file__).parent
ARQUIVOS = ["index.html", "app.js", "style.css"]

# cada item: (regex, motivo)
PROIBIDOS = [
    (r"\bfetch\s*\(", "requisicao de rede (fetch)"),
    (r"XMLHttpRequest", "requisicao de rede (XHR)"),
    (r"sendBeacon", "envio de dados (sendBeacon)"),
    (r"WebSocket|EventSource", "conexao de rede aberta"),
    (r"localStorage|sessionStorage|indexedDB", "armazenamento no navegador"),
    (r"document\.cookie", "cookies"),
    (r"<form\b", "formulario (envio de dados)"),
    (r"(src|href)\s*=\s*[\"']https?://", "recurso externo carregado de outro site"),
    (r"@import|url\(\s*[\"']?https?:", "CSS carregando recurso externo"),
    (r"import\s*\(", "import dinamico"),
]


def sem_comentarios(texto):
    texto = re.sub(r"<!--.*?-->", "", texto, flags=re.S)  # comentarios HTML
    texto = re.sub(r"/\*.*?\*/", "", texto, flags=re.S)  # comentarios de bloco
    return re.sub(r"(?m)//.*$", "", texto)  # comentarios de linha


problemas = []
for nome in ARQUIVOS:
    linhas = (PASTA / nome).read_text(encoding="utf-8").splitlines()
    for n, linha in enumerate(sem_comentarios("\n".join(linhas)).splitlines(), 1):
        for padrao, motivo in PROIBIDOS:
            if re.search(padrao, linha):
                problemas.append(f"{nome}:{n}  {motivo}")

# a politica de seguranca (CSP) precisa bloquear a rede
if "connect-src 'none'" not in (PASTA / "index.html").read_text(encoding="utf-8"):
    problemas.append("index.html  falta a CSP com connect-src 'none'")

if problemas:
    print("FALHOU:")
    print("\n".join(problemas))
    sys.exit(1)
print("OK: nenhum recurso de gravacao ou envio de dados encontrado.")
