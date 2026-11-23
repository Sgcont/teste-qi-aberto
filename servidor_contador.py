"""Contador anonimo e OPCIONAL do QI Aberto (compativel com WSGI).

Guarda apenas DOIS numeros: quantas pessoas compartilharam e a soma dos QIs.
Nao guarda IP, horario, tempos, respostas nem qualquer identificador, e nao gera logs.

Rotas:  GET /stats  ->  {"total": N, "media": X}
        POST /qi    ->  corpo {"qi": 55..145}

Local:        python servidor_contador.py            (porta 8001)
PythonAnywhere / gunicorn: aponte o WSGI para  application  deste arquivo.
Variaveis opcionais:  ORIGEM (endereco do seu site, ex: https://SEU-USUARIO.github.io)  ARQUIVO  PORT
"""
import json
import os
import threading
from wsgiref.simple_server import WSGIRequestHandler, make_server

AQUI = os.path.dirname(os.path.abspath(__file__))
ARQUIVO = os.environ.get("ARQUIVO", os.path.join(AQUI, "contador.json"))
ORIGEM = os.environ.get("ORIGEM", "*")  # em producao, restrinja ao endereco do seu site
trava = threading.Lock()
STATUS = {200: "200 OK", 204: "204 No Content", 400: "400 Bad Request", 404: "404 Not Found"}


def ler():
    try:
        with open(ARQUIVO, encoding="utf-8") as f:
            d = json.load(f)
        return int(d["total"]), int(d["soma"])
    except (OSError, ValueError, KeyError):
        return 0, 0


def resumo(total, soma):
    return {"total": total, "media": round(soma / total, 1) if total else None}


def application(environ, start_response):
    def resp(codigo, corpo=None):
        start_response(STATUS[codigo], [
            ("Access-Control-Allow-Origin", ORIGEM),
            ("Access-Control-Allow-Methods", "GET, POST, OPTIONS"),
            ("Access-Control-Allow-Headers", "Content-Type"),
            ("Content-Type", "application/json"),
        ])
        return [json.dumps(corpo).encode()] if corpo is not None else []

    metodo, caminho = environ["REQUEST_METHOD"], environ.get("PATH_INFO", "")
    if metodo == "OPTIONS":
        return resp(204)
    if metodo == "GET" and caminho == "/stats":
        with trava:
            return resp(200, resumo(*ler()))
    if metodo == "POST" and caminho == "/qi":
        try:
            tam = min(int(environ.get("CONTENT_LENGTH") or 0), 100)
            qi = int(json.loads(environ["wsgi.input"].read(tam))["qi"])
            assert 55 <= qi <= 145  # so aceita valores que o teste pode gerar
        except Exception:
            return resp(400, {"erro": "QI invalido"})
        with trava:
            total, soma = ler()
            total, soma = total + 1, soma + qi  # unica coisa que e gravada
            with open(ARQUIVO + ".tmp", "w", encoding="utf-8") as f:
                json.dump({"total": total, "soma": soma}, f)
            os.replace(ARQUIVO + ".tmp", ARQUIVO)  # troca atomica do arquivo
            return resp(200, resumo(total, soma))
    return resp(404, {"erro": "nao encontrado"})


class SemLog(WSGIRequestHandler):
    def log_message(self, *args):  # nenhuma requisicao e registrada
        pass


if __name__ == "__main__":
    porta = int(os.environ.get("PORT", 8001))
    print(f"Contador em http://127.0.0.1:{porta} (Ctrl+C para sair)")
    make_server("0.0.0.0", porta, application, handler_class=SemLog).serve_forever()
