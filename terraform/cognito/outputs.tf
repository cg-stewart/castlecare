output "customer_user_pool_id" {
  description = "The ID of the customer user pool"
  value       = aws_cognito_user_pool.customer_pool.id
}

output "customer_user_pool_client_id" {
  description = "The ID of the customer user pool client"
  value       = aws_cognito_user_pool_client.customer_client.id
}

output "customer_identity_pool_id" {
  description = "The ID of the customer identity pool"
  value       = aws_cognito_identity_pool.customer_identity_pool.id
}

output "worker_user_pool_id" {
  description = "The ID of the worker user pool"
  value       = aws_cognito_user_pool.worker_pool.id
}

output "worker_user_pool_client_id" {
  description = "The ID of the worker user pool client"
  value       = aws_cognito_user_pool_client.worker_client.id
}

output "worker_identity_pool_id" {
  description = "The ID of the worker identity pool"
  value       = aws_cognito_identity_pool.worker_identity_pool.id
}
