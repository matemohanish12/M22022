param($Context)

$VMNames = @()
$output = @()
$VMNames += Invoke-ActivityFunction -FunctionName 'CreateVM-Identify' -Input 2
 Foreach ($VMName in $VMNames)
 {
   $output += Invoke-ActivityFunction -FunctionName 'CreateVM-Acivity' -Input $VMName -NoWait
    Write-Output "$VmName will be created if the automation works correctly"
 }

#$output += Invoke-DurableActivity -FunctionName 'Hello' -Input 'London'
 
$output
