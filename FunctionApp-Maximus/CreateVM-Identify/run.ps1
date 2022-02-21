param($Count)

$VMNames = @()
For ($i = 0;$i -lt $count;$i++)
{
$VMNames += "VM-" + (((New-Guid).Guid).Replace("-","")).substring(0,12)
}
return $VMNames