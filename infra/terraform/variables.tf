variable "aws_region" {
  description = "Región de AWS para desplegar la infraestructura"
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "Nombre base de la aplicación"
  type        = string
  default     = "elegance-frontend"
}

variable "instance_type" {
  description = "Tipo de instancia EC2"
  type        = string
  default     = "t2.micro"
}

variable "backend_host" {
  description = "IP pública o host del backend microservicios"
  type        = string
  default     = "3.238.123.188"
}
