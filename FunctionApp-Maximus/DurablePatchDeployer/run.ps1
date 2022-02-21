param($Inputobject)

$URI =  “https://management.azure.com/subscriptions/$($Inputobject.SubscriptionId)/resourceGroups/$($Inputobject.AutomationResourceGroup)/providers/Microsoft.Automation/automationAccounts/$($Inputobject.AutomationAccount)/softwareUpdateConfigurations/$($Inputobject.UpdateDeploymentName)`?api-version=2018-01-15"
# Set the next run for Sunday at 3 am.
$NextSunday = (Get-Date).AddHours(1)
$StartDate = Get-Date $NextSunday -Format "s"
$ResourceID = $Inputobject.IDs
$Body = @"
{  
   "properties":{  
      "updateConfiguration":{  
         "operatingSystem":"Windows",
         "duration":"PT1H30M",
         "windows":{  
            "excludedKBNumbers":[],
            "includedUpdateClassifications":"Critical,Definition,Security,Tools,UpdateRollup,Updates",
            "rebootSetting": "Always"
         },
         "azureVirtualMachines":[  
               $ResourceID
         ],
         "nonAzureComputerNames":[  
         ]
      },
      "scheduleInfo":{  
         "frequency":"Hour",
         "startTime":"$StartDate",
         "timeZone":"America/Los_Angeles",  
         "interval":6,
         "advancedSchedule":{  
         }
      }
   }
}
"@

###AUTHENTICATION PIECE
$passwordClient = Get-AzKeyVaultSecret -VaultName M2Keyvaultw -Name SubSPN -AsPlainText
$TokenResult = Invoke-RestMethod -Uri "https://login.microsoftonline.com/$($Inputobject.TENANTID)/oauth2/token?api-version=1.0" `
                                 -Method Post `
                                 -Body @{"grant_type" = "client_credentials";"resource"="https://$($Inputobject.Resource)/";"client_id"="$($Inputobject.ClientID)";"client_secret"="$passwordClient"}
$token =$TokenResult.access_token
$Header = @{
    "Authorization" = "Bearer $token"
    "Host" = $Inputobject.resource
    "Content-type" = 'application/json'
}
#return  $Header
#####AUTHENTICATION PIECE END####
# Create update deployment job
$UpdateDeploymentJob = Invoke-RestMethod -Uri $uri -Method Put -Body $Body  -Headers $Header

# Wait for update provisioning job to complete 
While ($UpdateDeploymentJob.properties.provisioningState -eq "Provisioning") {
    Start-Sleep 5
    $UpdateDeploymentJob = Invoke-RestMethod -Uri $URI -Method GET -Headers $Header
}

if ($UpdateDeploymentJob.properties.provisioningState -eq "Failed")
{
    throw ("Error creating update deployment:" + $UpdateDeploymentJob.properties.error)
}
else
{
   Write-Output "Update deployment succeeded for the following computers:Write-Output $VMs.Name"
}
