terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.2.0"
}

provider "aws" {
  region = var.aws_region
}

# Customer User Pool
resource "aws_cognito_user_pool" "customer_pool" {
  name = "castlecare-customer-pool"
  
  username_attributes      = ["email"]
  auto_verify_attributes   = ["email"]
  
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }
  
  schema {
    name                = "email"
    attribute_data_type = "String"
    mutable             = true
    required            = true
  }
  
  schema {
    name                = "name"
    attribute_data_type = "String"
    mutable             = true
    required            = false
  }
  
  schema {
    name                = "phone_number"
    attribute_data_type = "String"
    mutable             = true
    required            = false
  }
  
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }
  
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }
  
  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject        = "Your CastleCare verification code"
    email_message        = "Your verification code is {####}"
  }
  
  tags = {
    Environment = var.environment
    Project     = "CastleCare"
  }
}

# Customer User Pool Client
resource "aws_cognito_user_pool_client" "customer_client" {
  name                         = "castlecare-customer-client"
  user_pool_id                 = aws_cognito_user_pool.customer_pool.id
  
  generate_secret              = false
  refresh_token_validity       = 30
  access_token_validity        = 1
  id_token_validity            = 1
  
  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }
  
  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH"
  ]
  
  supported_identity_providers = ["COGNITO"]
  
  callback_urls = ["http://localhost:3000/auth/callback", var.app_callback_url]
  logout_urls   = ["http://localhost:3000", var.app_logout_url]
  
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes                 = ["email", "openid", "profile"]
  
  prevent_user_existence_errors = "ENABLED"
}

# Customer Identity Pool
resource "aws_cognito_identity_pool" "customer_identity_pool" {
  identity_pool_name               = "castlecare_customer_identity_pool"
  allow_unauthenticated_identities = false
  allow_classic_flow               = false
  
  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.customer_client.id
    provider_name           = "cognito-idp.${var.aws_region}.amazonaws.com/${aws_cognito_user_pool.customer_pool.id}"
    server_side_token_check = false
  }
  
  supported_login_providers = {
    "graph.facebook.com"  = var.facebook_app_id
    "accounts.google.com" = var.google_app_id
  }
}

# Worker User Pool
resource "aws_cognito_user_pool" "worker_pool" {
  name = "castlecare-worker-pool"
  
  username_attributes      = ["email"]
  auto_verify_attributes   = ["email", "phone_number"]
  
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }
  
  # Required worker attributes
  schema {
    name                = "email"
    attribute_data_type = "String"
    mutable             = true
    required            = true
  }
  
  schema {
    name                = "given_name"
    attribute_data_type = "String"
    mutable             = true
    required            = true
  }
  
  schema {
    name                = "family_name"
    attribute_data_type = "String"
    mutable             = true
    required            = true
  }
  
  schema {
    name                = "phone_number"
    attribute_data_type = "String"
    mutable             = true
    required            = true
  }
  
  schema {
    name                = "birthdate"
    attribute_data_type = "String"
    mutable             = true
    required            = true
  }
  
  schema {
    name                = "address"
    attribute_data_type = "String"
    mutable             = true
    required            = true
  }
  
  # Additional worker attributes
  schema {
    name                = "custom:city"
    attribute_data_type = "String"
    mutable             = true
    required            = false
  }
  
  schema {
    name                = "custom:state"
    attribute_data_type = "String"
    mutable             = true
    required            = false
  }
  
  schema {
    name                = "custom:zip"
    attribute_data_type = "String"
    mutable             = true
    required            = false
  }
  
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
    recovery_mechanism {
      name     = "verified_phone_number"
      priority = 2
    }
  }
  
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }
  
  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject        = "Your CastleCare Worker verification code"
    email_message        = "Your verification code is {####}"
  }
  
  tags = {
    Environment = var.environment
    Project     = "CastleCare"
  }
}

# Worker User Pool Client
resource "aws_cognito_user_pool_client" "worker_client" {
  name                         = "castlecare-worker-client"
  user_pool_id                 = aws_cognito_user_pool.worker_pool.id
  
  generate_secret              = false
  refresh_token_validity       = 30
  access_token_validity        = 1
  id_token_validity            = 1
  
  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }
  
  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH"
  ]
  
  supported_identity_providers = ["COGNITO"]
  
  callback_urls = ["http://localhost:3000/drive/complete-application", var.worker_callback_url]
  logout_urls   = ["http://localhost:3000", var.worker_logout_url]
  
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes                 = ["email", "openid", "profile"]
  
  prevent_user_existence_errors = "ENABLED"
}

# Worker Identity Pool
resource "aws_cognito_identity_pool" "worker_identity_pool" {
  identity_pool_name               = "castlecare_worker_identity_pool"
  allow_unauthenticated_identities = false
  allow_classic_flow               = false
  
  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.worker_client.id
    provider_name           = "cognito-idp.${var.aws_region}.amazonaws.com/${aws_cognito_user_pool.worker_pool.id}"
    server_side_token_check = false
  }
}

# IAM Roles for Identity Pools
resource "aws_iam_role" "authenticated_customer" {
  name = "cognito_authenticated_customer_role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.customer_identity_pool.id
          }
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "authenticated"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role" "authenticated_worker" {
  name = "cognito_authenticated_worker_role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.worker_identity_pool.id
          }
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "authenticated"
          }
        }
      }
    ]
  })
}

# Attach roles to identity pools
resource "aws_cognito_identity_pool_roles_attachment" "customer_roles" {
  identity_pool_id = aws_cognito_identity_pool.customer_identity_pool.id
  
  roles = {
    "authenticated" = aws_iam_role.authenticated_customer.arn
  }
}

resource "aws_cognito_identity_pool_roles_attachment" "worker_roles" {
  identity_pool_id = aws_cognito_identity_pool.worker_identity_pool.id
  
  roles = {
    "authenticated" = aws_iam_role.authenticated_worker.arn
  }
}
