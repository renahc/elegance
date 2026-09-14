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
    mkdir -p /var/www/salon-belleza
    chown -R ec2-user:ec2-user /var/www
  EOF
  )

  tags = {
    Name = "${var.app_name}-ec2"
  }
}
