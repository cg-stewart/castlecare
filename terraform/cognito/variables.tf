variable "aws_region" {
  description = "The AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "app_callback_url" {
  description = "Customer app callback URL for production"
  type        = string
  default     = "https://castlecare.com/auth/callback"
}

variable "app_logout_url" {
  description = "Customer app logout URL for production"
  type        = string
  default     = "https://castlecare.com"
}

variable "worker_callback_url" {
  description = "Worker app callback URL for production"
  type        = string
  default     = "https://castlecare.com/drive/complete-application"
}

variable "worker_logout_url" {
  description = "Worker app logout URL for production"
  type        = string
  default     = "https://castlecare.com"
}

variable "facebook_app_id" {
  description = "Facebook App ID for social login"
  type        = string
  default     = ""
  sensitive   = true
}

variable "google_app_id" {
  description = "Google App ID for social login"
  type        = string
  default     = ""
  sensitive   = true
}
