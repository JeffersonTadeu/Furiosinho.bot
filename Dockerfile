FROM n8nio/n8n

# Configurações básicas
ENV N8N_HOST=0.0.0.0
ENV N8N_PORT=5678
ENV N8N_BASIC_AUTH_ACTIVE=true
ENV N8N_BASIC_AUTH_USER=admin
ENV N8N_BASIC_AUTH_PASSWORD=admin123

# Garante que o banco de dados e workflows serão salvos no disco
ENV N8N_USER_FOLDER=/home/node/.n8n
ENV DB_TYPE=sqlite
ENV DB_SQLITE_DATABASE=/home/node/.n8n/database.sqlite

# Configura a URL do webhook corretamente para HTTPS
ENV WEBHOOK_URL=https://furiosinho-bot.onrender.com

EXPOSE 5678
