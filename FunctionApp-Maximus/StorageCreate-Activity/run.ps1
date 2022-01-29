param($InputObject)

write-output "InputObject StorageAccountName M2 $($InputObject)"
Select-Azsubscription -SubscriptionID 722ff779-f513-46b1-87c9-6a5a717ed1ea
New-AzStorageAccount -ResourceGroupName M2AZDurableFunction -AccountName $InputObject -Location westus2 -SkuName Standard_GRS