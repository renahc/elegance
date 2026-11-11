#!/usr/bin/env bash
set -Eeuo pipefail

echo "Installing Nginx on Amazon Linux 2..."
sudo amazon-linux-extras install -y nginx1 || sudo yum install -y nginx

sudo mkdir -p /var/www/salon-belleza /etc/ssl/certs /etc/ssl/private
sudo chown -R ec2-user:ec2-user /var/www/salon-belleza

if [[ ! -f /etc/ssl/certs/salon-selfsigned.crt ]]; then
  sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/salon-selfsigned.key \
    -out /etc/ssl/certs/salon-selfsigned.crt \
    -subj '/CN=salon-belleza'
fi

sudo tee /etc/nginx/conf.d/salon.conf >/dev/null <<'EOF'
server {
    listen 80;
    server_name _;
    root /var/www/salon-belleza;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 443 ssl;
    server_name _;
    root /var/www/salon-belleza;
    index index.html;

    ssl_certificate /etc/ssl/certs/salon-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/salon-selfsigned.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

sudo rm -f /etc/nginx/conf.d/default.conf
sudo systemctl enable nginx
sudo nginx -t
sudo systemctl restart nginx
