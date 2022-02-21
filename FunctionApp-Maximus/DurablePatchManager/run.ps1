param($Context)

$output = @()
#$cred = Get-Credential -Message Test -UserName m2admin 
$password= Get-AzKeyVaultSecret -VaultName M2Keyvaultw -Name m2admin
$cred= new-Object System.Management.Automation.PSCredential ('m2admin',$password.SecretValue)

$records = Invoke-SQLCMD -ServerInstance "m2sqlserverdev.database.windows.net" -Database "MyworkDB" -Query  "Select * from AutomationInputs WHERE VMResourceGroup is not NULL" -Credential $cred 
#$records 
foreach ($record in $records)
{
    $output =   Invoke-ActivityFunction -FunctionName 'DurablePatchDataCollector' -Input $record
    $DeployInput = $record.psobject.Copy()
    $DeployInput | Add-Member -MemberType NoteProperty -Name IDs -Value $output
    If ( $null -ne $record)
       {
         Invoke-ActivityFunction -FunctionName 'DurablePatchDeployer' -Input $DeployInput
         Write-Output "Found Inputs for DataCollection"
       }
}
#$Json = ($records | ConvertTo-Json -Depth 5 -Compress)