output "cloudfront_url" {
  description = "URL do site via CloudFront"
  value       = "https://${aws_cloudfront_distribution.web.domain_name}"
}

output "cloudfront_domain_name" {
  description = "Domínio do CloudFront (para CNAME na Namecheap)"
  value       = aws_cloudfront_distribution.web.domain_name
}

output "cloudfront_distribution_id" {
  description = "ID da distribuição CloudFront (usado na invalidação de cache)"
  value       = aws_cloudfront_distribution.web.id
}

output "s3_bucket_name" {
  description = "Nome do bucket S3 onde o frontend é publicado"
  value       = aws_s3_bucket.web.id
}

# --- Outputs para domínio customizado (Namecheap) ---

output "site_url" {
  description = "URL final do site (com domínio customizado se configurado)"
  value       = var.domain_name != "" ? "https://${var.domain_name}" : "https://${aws_cloudfront_distribution.web.domain_name}"
}

output "domain_cname_target" {
  description = "Valor do CNAME na Namecheap: aponte seu domínio (Host) para este valor (Value)"
  value       = var.domain_name != "" ? aws_cloudfront_distribution.web.domain_name : null
}

output "acm_validation_cname_name" {
  description = "Nome do registro CNAME para validar o certificado SSL na Namecheap (Host)"
  value       = var.domain_name != "" ? tolist(aws_acm_certificate.web[0].domain_validation_options)[0].resource_record_name : null
}

output "acm_validation_cname_value" {
  description = "Valor do CNAME de validação SSL na Namecheap (Value)"
  value       = var.domain_name != "" ? tolist(aws_acm_certificate.web[0].domain_validation_options)[0].resource_record_value : null
}
