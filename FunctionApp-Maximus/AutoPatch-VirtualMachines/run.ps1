param($name)

"Hello $name!"


$LogAnalyticsApi = "https://api.loganalytics.io/v1/workspaces/$Workspaceid/query?timespan=P1D"
$WindowsNonCompliantVMQuery  = "Update 
                                | where Timegenerated > ago(12h) | where OStype != 'Linux' and Optional == false 
                                | where Classification == 'Security Updates' or Classification == 'Critical Updates' 
                                | summ
                                 
                                 "
$LinuxNonCompliantVMQuery 


$WindowsNonCompliantVMs = Invoke-RestMethod -Uri $LogAnalyticsApi -Headers $Headers -Method Post -Body (@{ "query" = $WindowsNonCompliantVMQuery} | ConvertTo-Json)

$LinuxNonCompliantVMs = Invoke-RestMethod -Uri $LogAnalyticsApi -Headers $Headers -Method Post -Body (@{ "query" = $LinuxNonCompliantVMQuery} | ConvertTo-Json)
$WindowsVMresult = Get-OMSlog -VMresourceDetails $WindowsNonCompliantVMs
$LinuxVMresult = Get-OMSlog -VMresourceDetails $LinuxNonCompliantVMs


#We may need to add the logic to filter the subscriptions based on environment

$WinStartTime = [System.DateTimeOffset]((Get-Date).ToUniversalTime().AddMinutes(15))
$WindowsTime = [System.DateTimeOffset]((Get-Date).ToUniversalTime())
$WindowsTimeStamp = Get-Date  $WindowsTime.DateTime -Format "yyyy_MM_dd_HH_mm_ss"
$WindowsScheduleName = "$($AA)_Windows_Schedule_$($WindowsTimeStamp)"
$WindowsUpdateTypes = @("Critical","Security","Updates","Definition","UpdateRollup")
$WindowsUpdates =$WindowsUpdateTypes -join ','

$WindowsVMResourceID = $WindowsVMresult.ResourceID  ## Identify the resourceIDs of VMS
$WindowsVMSubScriptions = $WindowsVMresult | %{return "Subscriptions/$($_.SubscriptionID)"} | Select-Object -Unique

$WindowsUpdatesConfigBody = @{
                                "properties" =@{
                                    "UpdateConfiguration"  =@{
                                        "OperatingSystem" = "Windows"
                                        "duration" = "PT6H0M"
                                        "Windows" = @{
                                            "includeUpdateConfigurations" = $WindowsUpdates
                                            "rebootSetting" = "IfRequired"
                                        }
                                    "Targets" = @{
                                        "AzureQueries" =@(
                                            @{
                                                "scope"=@($WindowsVMSubScriptions)
                                            }
                                        )
                                    }
                                    }
                                    "ScheduleInfo" =@{
                                        "frequency" = "OneTime"
                                        "Starttime" = $($WinStartTime)
                                    }
                                }
                             }
