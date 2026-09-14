terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ==========================================
# CLAVE SSH DINÁMICA
# ==========================================
resource "tls_private_key" "frontend_ssh_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "frontend_key" {
  key_name_prefix = "${var.app_name}-key-"
  public_key      = tls_private_key.frontend_ssh_key.public_key_openssh
}

# ==========================================
# SECURITY GROUP FRONTEND (PUERTOS 80, 22)
# ==========================================
resource "aws_security_group" "frontend_sg" {
  name_prefix = "${var.app_name}-sg-"
  description = "Security Group para el Frontend Nginx"

  ingress {
    description = "SSH Access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP Access"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ==========================================
# AMI AMAZON LINUX 2
# ==========================================
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# ==========================================
# INSTANCIA EC2 FRONTEND
# ==========================================
resource "aws_instance" "elegance_frontend_ec2" {
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = var.instance_type
  key_name                    = aws_key_pair.frontend_key.key_name
  security_groups             = [aws_security_group.frontend_sg.name]
  user_data_replace_on_change = true

  user_data = base64encode(<<-EOF
    #!/bin/bash
    set -e
    
    STATUS_FILE="/var/www/status.txt"
    mkdir -p /var/www/salon-belleza
    chown -R ec2-user:ec2-user /var/www
    echo "BOOTING" > $STATUS_FILE
    
    exec > >(tee -a /var/log/user-data.log) 2>&1
    echo "[$(date)] === Instalando Nginx en EC2 Frontend ==="
    
    amazon-linux-extras install -y nginx1 || yum install -y nginx || true
    
    cat <<NGINX_CONF > /etc/nginx/conf.d/salon.conf
server {
    listen 80;
    server_name _;

    root /var/www/salon-belleza;
    index index.html;

    location / {
        try_files \\$uri \\$uri/ /index.html;
    }

    location /api/v1/appointments {
        proxy_pass http://${var.backend_host}:8081;
        proxy_set_header Host \\$host;
        proxy_set_header X-Real-IP \\$remote_addr;
    }

    location /api/v1/services {
        proxy_pass http://${var.backend_host}:8081;
        proxy_set_header Host \\$host;
        proxy_set_header X-Real-IP \\$remote_addr;
    }

    location /api/v1/clients {
        proxy_pass http://${var.backend_host}:8082;
        proxy_set_header Host \\$host;
        proxy_set_header X-Real-IP \\$remote_addr;
    }

    location /api/v1/stylists {
        proxy_pass http://${var.backend_host}:8082;
        proxy_set_header Host \\$host;
        proxy_set_header X-Real-IP \\$remote_addr;
    }

    location /api/v1/auth {
        proxy_pass http://${var.backend_host}:8082;
        proxy_set_header Host \\$host;
        proxy_set_header X-Real-IP \\$remote_addr;
    }

    location /api/v1/notifications {
        proxy_pass http://${var.backend_host}:8083;
        proxy_set_header Host \\$host;
        proxy_set_header X-Real-IP \\$remote_addr;
    }
}
NGINX_CONF

    sed -i 's/listen       80 default_server;/listen       80;/g' /etc/nginx/nginx.conf 2>/dev/null || true

    systemctl enable nginx || true
    systemctl restart nginx || true
    
    echo "READY" > $STATUS_FILE
    echo "[$(date)] === Nginx Frontend Aprovisionado Exitosamente ==="
  EOF
  )

  tags = {
    Name = "${var.app_name}-ec2"
  }
}
