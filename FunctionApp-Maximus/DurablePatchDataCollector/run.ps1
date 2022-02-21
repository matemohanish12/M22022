param($InputObject)

$Query ="Update
| where TimeGenerated > ago(6h)
| where Classification in ('Security Updates', 'Critical Updates','Definition Updates','Update Rollups','Updates')
| where _ResourceId  in ((Heartbeat
| where TimeGenerated > ago(30m)
| distinct  _ResourceId
            ))
| where UpdateState == 'Needed' and Optional == false and Approved == true
| summarize count() by  Computer, _ResourceId,SubscriptionId,ResourceGroup"   

#Write-Output  $($InputObject.Workspaceid)
$VulnerableComputers = Invoke-AzOperationalInsightsQuery -WorkspaceId $($InputObject.Workspaceid) -Query $Query
$ComputersArray =[System.Linq.Enumerable]::ToArray($VulnerableComputers.Results)
foreach ($Computer in $ComputersArray)
{
    $resourceIDs +='"' + $Computer._ResourceId + '",'
}
$resourceIDs = $resourceIDs.TrimEnd(",")

return $resourceIDs