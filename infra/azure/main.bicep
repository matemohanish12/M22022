param location string = resourceGroup().location
param siteName string
param skuName string = 'S1'
param skuTier string = 'Standard'
param appServicePlanName string = '${siteName}-plan'
param backendWebAppName string = '${siteName}-backend'
param frontendStaticSiteName string = '${siteName}-frontend'
param postgresServerName string = '${siteName}-pg'
param postgresAdministratorLogin string = 'pgadmin'
param postgresAdministratorPassword string
param postgresDbName string = 'bcmdb'

// App Service Plan for backend
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

// Backend Web App (Linux)
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
        {
          name: 'POSTGRES_HOST'
          value: postgresServer.properties.fullyQualifiedDomainName
        }
        {
          name: 'POSTGRES_DB'
          value: postgresDbName
        }
        {
          name: 'POSTGRES_USER'
          value: '${postgresAdministratorLogin}@${postgresServer.name}'
        }
      ]
    }
  }
  dependsOn: [appServicePlan, postgresServer]
}

// Static Web App for frontend (recommended for production static hosting + APIs via backend)
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

// Application Insights
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${siteName}-ai'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
  }
}

// Azure Database for PostgreSQL - Flexible Server
resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2021-06-01' = {
  name: postgresServerName
  location: location
  properties: {
    administratorLogin: postgresAdministratorLogin
    administratorLoginPassword: postgresAdministratorPassword
    version: '13'
    storage: {
      storageSizeGB: 32
    }
    network: {
      publicNetworkAccess: 'Enabled'
    }
  }
  sku: {
    name: 'GP_Standard_D2s_v3'
    tier: 'GeneralPurpose'
    capacity: 2
  }
}

// Sample database resource (creates db on server) - note: flexible server may require separate call; using nested child resource
resource postgresDb 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2021-06-01' = {
  name: '${postgresServer.name}/${postgresDbName}'
  properties: {}
  dependsOn: [postgresServer]
}

output backendAppId string = backendWebApp.id
output backendDefaultHostname string = backendWebApp.properties.defaultHostName
output staticSiteId string = staticWebApp.id
output postgresHost string = postgresServer.properties.fullyQualifiedDomainName
output postgresDb string = postgresDb.name
output appInsightsInstrumentationKey string = appInsights.properties.InstrumentationKey
