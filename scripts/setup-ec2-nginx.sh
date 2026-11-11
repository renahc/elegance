#!/bin/bash
# AWS EC2 Nginx Provisioning Script for Élégance Beauty Studio
set -e

echo "=== Updating packages and installing Nginx ==="
sudo apt-get update -y
sudo apt-get install -y nginx

echo "=== Creating web root directory ==="
sudo mkdir -p /var/www/salon-belleza
sudo chown -R ubuntu:ubuntu /var/www/salon-belleza

echo "=== Configuring Nginx Site ==="
sudo tee /etc/nginx/sites-available/salon-belleza << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    root /var/www/salon-belleza;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/v1/ {
        proxy_pass http://localhost:8080/api/v1/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

echo "=== Enabling site and restarting Nginx ==="
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/salon-belleza /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo "=== Nginx Configuration Complete! ==="
