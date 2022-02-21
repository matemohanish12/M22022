# Azure Functions profile.ps1
#
# This profile.ps1 will get executed every "cold start" of your Function App.
# "cold start" occurs when:
#
# * A Function App starts up for the very first time
# * A Function App starts up after being de-allocated due to inactivity
#
# You can define helper functions, run commands, or specify environment variables
# NOTE: any variables defined that are not environment variables will get reset after the first execution

# Authenticate with Azure PowerShell using MSI.
# Remove this if you are not planning on using MSI or Azure PowerShell.
if ($env:MSI_SECRET) {
    Disable-AzContextAutosave -Scope Process | Out-Null
    Connect-AzAccount -Identity
}

# Uncomment the next line to enable legacy AzureRm alias in Azure PowerShell.
# Enable-AzureRmAlias
#Import-Module Az.Accounts
# You can also define functions or aliases that can be referenced in any of your PowerShell functions.

#-Tenant "556fe100-3865-4044-9060-d2ad023716d4"
$SPJN = "d8e86c20-96f9-49a3-936e-1cbf83905e65"
$Password = "UPS7Q~c89scxjjZaFPiuNPLkc~jBz_U0gIwsY" #(Get-AzKeyVaultSecret -VaultName M2Keyvaultw -Name SubSPN).SecretValue
$SPassword = ConvertTo-SecureString -String "$Password" -AsPlainText -Force
$Credential = New-Object -typeName System.Management.Automation.PSCredential -ArgumentList  ($SPJN, $SPassword)
Connect-AzAccount -Credential $Credential -Tenant "556fe100-3865-4044-9060-d2ad023716d4" -ServicePrincipal
Select-AzSubscription -SubscriptionId "722ff779-f513-46b1-87c9-6a5a717ed1ea" #-tenant  "556fe100-3865-4044-9060-d2ad023716d4"
