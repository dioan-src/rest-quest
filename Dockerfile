# Use PHP with Apache as the base image
FROM php:8.1-apache as web

#copy virtual host into container
COPY rest-quest.conf /etc/apache2/sites-available/rest-quest.conf

#enable rewrite mode
RUN a2enmod rewrite

#install packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libzip-dev \
    wget \
    git \
    unzip

RUN docker-php-ext-install zip pdo_mysql

# Set ownership and permissions for the web directory
RUN chown -R www-data:www-data /var/www && \
    chmod -R 755 /var/www

# Enable the virtual host
RUN a2ensite rest-quest.conf && \
    a2dissite 000-default.conf

# Copy application files
COPY . /var/www/html/rest-quest

# Set the working directory
WORKDIR /var/www/html/rest-quest

# Expose the port
EXPOSE 8010

# Start Apache
CMD ["apache2-foreground"]