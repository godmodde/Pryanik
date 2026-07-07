#!/usr/bin/env bash
# Пряничный двор — локальный статический сервер.
# Использование: bash serve.sh [порт]   (по умолчанию 8000)
# Если порт занят, скрипт сам возьмёт следующий свободный.
set -euo pipefail

WANT="${1:-8000}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

# Находим первый свободный порт начиная с WANT
PORT="$(python3 - "$WANT" <<'PY'
import socket, sys
p = int(sys.argv[1])
for port in range(p, p + 50):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        s.bind(("0.0.0.0", port))
        s.close()
        print(port); break
    except OSError:
        s.close()
else:
    print(p)
PY
)"

if [ "$PORT" != "$WANT" ]; then
  echo "Порт $WANT занят — беру свободный $PORT"
fi
echo "Пряничный двор → http://localhost:${PORT}   (Ctrl+C — остановить)"
# Слушаем все интерфейсы (0.0.0.0), чтобы работал проброс порта в VS Code / удалённой среде
exec python3 -m http.server "${PORT}" --bind 0.0.0.0
