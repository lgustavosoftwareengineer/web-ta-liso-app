# Certificado SSL e validação DNS para o domínio do frontend.
# CloudFront exige que o certificado ACM esteja na região us-east-1.

resource "aws_acm_certificate" "web" {
  count = var.domain_name != "" ? 1 : 0

  domain_name       = var.domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate_validation" "web" {
  count = var.domain_name != "" ? 1 : 0

  certificate_arn = aws_acm_certificate.web[0].arn

  timeouts {
    create = "45m"
  }
}
