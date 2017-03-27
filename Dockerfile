FROM php:7.0-apache
STOPSIGNAL SIGWINCH

RUN apt-get update && \
    apt-get install -y git zip

RUN docker-php-ext-install pdo pdo_mysql

RUN a2enmod rewrite

RUN echo "pcre.jit=0" >> /usr/local/etc/php/php.ini
