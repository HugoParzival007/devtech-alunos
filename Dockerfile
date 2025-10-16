# Dockerfile - serve os arquivos estáticos via nginx
FROM nginx:stable-alpine

# Remove configuração default (opcional) e copia os arquivos do site para a pasta do nginx
COPY ./ /usr/share/nginx/html

# Expor porta
EXPOSE 80

# O container já inicia o nginx automaticamente na imagem oficial
