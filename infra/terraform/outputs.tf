output "frontend_public_ip" {
  description = "Dirección IP pública de la instancia EC2 del Frontend"
  value       = aws_instance.elegance_frontend_ec2.public_ip
}

output "frontend_private_key_pem" {
  description = "Clave privada PEM para conexión SSH a la EC2 del Frontend"
  value       = tls_private_key.frontend_ssh_key.private_key_pem
  sensitive   = true
}
