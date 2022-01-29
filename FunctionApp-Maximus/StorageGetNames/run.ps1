param([int]$maxcount)
$storageaccountNames=@()
for ($i = 1; $i -le $maxcount ;$i++)
{
    $Guid = New-Guid
   $storageaccountNames +=  ($Guid.Guid).Replace("-","").Substring(0,24)
}

return $storageaccountNames