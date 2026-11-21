"""Contador anonimo e OPCIONAL do QI Aberto.

Guarda apenas DOIS numeros: quantas pessoas compartilharam e a soma dos QIs.
Nao guarda IP, horario, tempos, respostas nem qualquer identificador, e nao gera logs.

Uso local:  python servidor_contador.py   (porta 8001)
Hospedagem: defina PORT (e ORIGEM com o endereco do seu site, ex: https://SEU-USUARIO.github.io)
"""
import json
import os
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer

ARQUIVO = os.environ.get("ARQUIVO", "contador.json")
ORIGEM = os.environ.get("ORIGEM", "*")  # em producao, restrinja ao endereco do seu site
trava = threading.Lock()


def ler():
    try:
        with open(ARQUIVO, encoding="utf-8") as f:
            d = json.load(f)
        return int(d["total"]), int(d["soma"])
    except (OSError, ValueError, KeyError):
        return 0, 0


def resumo(total, soma):
    return {"total": total, "media": round(soma / total, 1) if total else None}


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):  # sem logs: nenhuma requisicao e registrada
        pass

    def responder(self, codigo, corpo=None):
        self.send_response(codigo)
        self.send_header("Access-Control-Allow-Origin", ORIGEM)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        if corpo is not None:
            self.wfile.write(json.dumps(corpo).encode())

    def do_OPTIONS(self):
        self.responder(204)

    def do_GET(self):
        if self.path != "/stats":
            return self.responder(404, {"erro": "nao encontrado"})
        with trava:
            self.responder(200, resumo(*ler()))

    def do_POST(self):
        if self.path != "/qi":
            return self.responder(404, {"erro": "nao encontrado"})
        try:
            tam = int(self.headers.get("Content-Length", 0))
            qi = int(json.loads(self.rfile.read(min(tam, 100)))["qi"])
            assert 55 <= qi <= 145  # so aceita valores que o teste pode gerar
        except Exception:
            return self.responder(400, {"erro": "QI invalido"})
        with trava:
            total, soma = ler()
            total, soma = total + 1, soma + qi  # unica coisa que e gravada
            with open(ARQUIVO, "w", encoding="utf-8") as f:
                json.dump({"total": total, "soma": soma}, f)
            self.responder(200, resumo(total, soma))


if __name__ == "__main__":
    porta = int(os.environ.get("PORT", 8001))
    print(f"Contador em http://127.0.0.1:{porta} (Ctrl+C para sair)")
    HTTPServer(("0.0.0.0", porta), Handler).serve_forever()
