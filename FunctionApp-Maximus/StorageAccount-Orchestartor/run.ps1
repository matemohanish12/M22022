param($Context)

$StorageAccountNames = @()

$StorageAccountNames += Invoke-ActivityFunction -FunctionName 'StorageGetNames' -Input 5
foreach ($StorageAccountName in $StorageAccountNames) {
    #$StorageAccountName | Add-Member -NotePropertyName SubscriptionID -NotePropertyValue '722ff779-f513-46b1-87c9-6a5a717ed1ea'
    Invoke-ActivityFunction -FunctionName 'StorageCreate-Activity' -Input $StorageAccountName
}

