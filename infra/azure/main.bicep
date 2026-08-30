param location string = resourceGroup().location
param siteName string
param skuName string = 'S1'
param skuTier string = 'Standard'
param appServicePlanName string = '${siteName}-plan'
param backendWebAppName string = '${siteName}-backend'
param frontendStaticSiteName string = '${siteName}-frontend'

resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: appServicePlanName
  location: location
  kind: 'linux'
  properties: {
    reserved: true
  }
  sku: {
    name: skuName
    tier: skuTier
  }
}

resource backendWebApp 'Microsoft.Web/sites@2023-01-01' = {
  name: backendWebAppName
  location: location
  kind: 'app,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    reserved: true
    siteConfig: {
      linuxFxVersion: 'NODE|20'
      appSettings: [
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
        {
          name: 'NODE_ENV'
          value: 'production'
        }
      ]
    }
  }
}

resource staticWebApp 'Microsoft.Web/staticSites@2023-01-01' = {
  name: frontendStaticSiteName
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: ''
    branch: 'main'
    buildProperties: {
      appLocation: 'frontend'
      outputLocation: 'dist'
      appBuildCommand: 'npm run build'
    }
  }
}

output backendAppId string = backendWebApp.id
output backendDefaultHostname string = backendWebApp.properties.defaultHostName
output staticSiteId string = staticWebApp.id
