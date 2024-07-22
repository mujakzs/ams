FROM nginx:1.15.9-alpine

COPY ./files /var/www
COPY ./nginx /etc/nginx

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
