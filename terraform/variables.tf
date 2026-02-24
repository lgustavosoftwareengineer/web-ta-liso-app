variable "aws_region" {
  description = "Região AWS"
  default     = "us-east-1"
}

variable "project_name" {
  description = "Nome do projeto (usado no bucket S3 e CloudFront)"
  default     = "ta-liso-web"
}

variable "domain_name" {
  description = "Domínio customizado para o frontend (ex: app.ta-liso-app.online ou www.ta-liso-app.online). Deixe vazio para usar só a URL do CloudFront."
  default     = ""
  type        = string
}
