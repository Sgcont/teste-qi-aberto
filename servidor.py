"""Servidor local do QI Aberto.

Apenas entrega os arquivos estaticos da pasta. Nao grava logs, nao guarda
nada em disco e so aceita conexoes da propria maquina (127.0.0.1).

Uso:  python servidor.py   e abra  http://127.0.0.1:8000
"""
import http.server
import socketserver

PORTA = 8000


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):  # silencia o log: nenhuma requisicao e registrada
        pass

    def do_POST(self):  # o app nunca envia dados, entao POST e recusado
        self.send_error(405, "Metodo nao permitido")

    def end_headers(self):
        # reforco da politica de seguranca tambem pelo cabecalho HTTP
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()


if __name__ == "__main__":
    with socketserver.TCPServer(("127.0.0.1", PORTA), Handler) as servidor:
        print(f"QI Aberto em http://127.0.0.1:{PORTA} (Ctrl+C para sair)")
        try:
            servidor.serve_forever()
        except KeyboardInterrupt:
            print("\nEncerrado.")
