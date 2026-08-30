Azure infra Bicep template

Files:
- main.bicep — creates App Service Plan, backend Web App, and Static Web App for frontend.

Deploy (example):
1. az group create -n my-rg -l eastus
2. az deployment group create -g my-rg --template-file infra/azure/main.bicep --parameters siteName=my-bcm-site location=eastus

Notes:
- The static web app resource requires further configuration (deployment token) or use GitHub Actions to deploy.
- Set secrets in GitHub repository for AZURE_BACKEND_PUBLISH_PROFILE and AZURE_STATIC_WEBAPPS_API_TOKEN for CI deployments.
