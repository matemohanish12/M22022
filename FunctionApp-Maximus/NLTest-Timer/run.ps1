# Input bindings are passed in via param block.
param($Timer)

# Get the current universal time in the default string format
$currentUTCtime = (Get-Date).ToUniversalTime()
#$(Get-Module -ListAvailable | Select-Object Name, Path )
# The 'IsPastDue' porperty is 'true' when the current function invocation is later than scheduled.
if ($Timer.IsPastDue) {
    Write-Host "PowerShell timer is running late!"
}

#Start-NewOrchestration -FunctionName NLTest-Orchestrator
#Start-NewOrchestration -FunctionName StorageAccount-Orchestartor
Start-NewOrchestration -FunctionName DurablePatchManager
#Start-NewOrchestration -FunctionName CreateVM-Orchestrator
# Write an information log with the current time.
Write-Host "PowerShell timer trigger function ran! TIME: $currentUTCtime"
