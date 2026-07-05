FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=7860

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends nodejs npm && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r backend/requirements.txt

COPY frontend/package.json ./frontend/package.json
COPY frontend/vite.config.js ./frontend/vite.config.js
COPY frontend/index.html ./frontend/index.html
COPY frontend/public ./frontend/public
COPY frontend/src ./frontend/src
COPY frontend/README.md ./frontend/README.md

RUN cd frontend && npm install && npm run build

COPY backend ./backend
COPY start.sh ./start.sh

RUN chmod +x /app/start.sh

EXPOSE 7860

CMD ["/app/start.sh"]
