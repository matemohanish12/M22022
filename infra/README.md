# Azure Infrastructure Deployment

This folder contains Azure Infrastructure-as-Code (IaC) templates for deploying the BCM platform to Azure.

## Prerequisites

- Azure CLI (`az` command)
- An Azure subscription with permissions to create resources
- Resource group created or available

## Files

- `main.bicep` — Azure Bicep template defining:
  - App Service Plan (for backend)
  - Web App for backend (Linux, Node.js 20)
  - Static Web App for frontend
  - Networking and authentication ready

## Deployment

### 1. Create a Resource Group (if needed)

```bash
az group create \
  --name bcm-platform-rg \
  --location eastus
```

### 2. Deploy Infrastructure

```bash
az deployment group create \
  --resource-group bcm-platform-rg \
  --template-file main.bicep \
  --parameters \
    siteName=bcm-platform-prod \
    location=eastus \
    skuName=S1 \
    skuTier=Standard
```

### 3. Configure GitHub Secrets

After deployment, configure the following GitHub secrets for the CI/CD pipeline:

#### For Backend Deployment:
- `AZURE_BACKEND_APP_NAME` — The name of the backend Web App (e.g., `bcm-platform-prod-backend`)
- `AZURE_BACKEND_PUBLISH_PROFILE` — Publish profile from Web App (download from Azure Portal → Web App → Deployment Center → Download Profile)

#### For Frontend Deployment:
- `AZURE_STATIC_WEBAPPS_API_TOKEN` — API token from Static Web App (from Azure Portal → Static Web App → Manage deployment token)

### 4. Verify Deployment

```bash
# List deployed resources
az resource list --resource-group bcm-platform-rg --output table

# Get backend URL
az webapp show \
  --resource-group bcm-platform-rg \
  --name bcm-platform-prod-backend \
  --query defaultHostName -o tsv

# Get Static Web App URL
az staticwebapp show \
  --resource-group bcm-platform-rg \
  --name bcm-platform-prod-frontend \
  --query "defaultDomain" -o tsv
```

## Parameters

- `siteName` (required) — Base name for resources (e.g., `bcm-platform-prod`)
- `location` (optional, default: resource group location) — Azure region (e.g., `eastus`, `westus2`)
- `skuName` (optional, default: `S1`) — App Service Plan SKU (e.g., `S1`, `S2`, `P1V2`)
- `skuTier` (optional, default: `Standard`) — App Service Plan tier

## Cleanup

To remove all deployed resources:

```bash
az group delete --name bcm-platform-rg
```

## Notes

- The Static Web App uses the Free tier; upgrade `sku.name` and `sku.tier` for production.
- Backend Web App runs Node.js 20 LTS on Linux.
- Both services are configured with auto-scaling and monitoring ready.
- Store credentials securely in GitHub Secrets, never in code.
