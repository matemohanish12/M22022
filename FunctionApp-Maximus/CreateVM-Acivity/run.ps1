param($name)
Import-Module Az.Compute
$VMLocalAdminUser = "m2admin"
$VMLocalAdminSecurePassword = (Get-AzKeyVaultSecret -VaultName M2Keyvaultw -Name m2admin).SecretValue
$LocationName = "westus2"
$ResourceGroupName = "M2AZDurableFunction"
$ComputerName = $name
$VMName = $name    
$VMSize = "Standard_B2ms"
$NetworkName = "MyNet"
$NICName = $name + '-MyNIC'
$SubnetName = "MySubnet"
$SubnetAddressPrefix = "192.168.0.0/24"
$VnetAddressPrefix = "192.168.0.0/16"

$VNet = Get-AzVirtualNetwork -Name $NetworkName -ResourceGroupName $ResourceGroupName -EA SilentlyContinue
If ($VNet.Name -eq $NetworkName)
{
    Write-Output "Vnet $NetworkName Already Exists!!"
}
else {
    Write-Output "Creating New Vnet $NetworkName!!"
    $SingleSubnet = New-AzVirtualNetworkSubnetConfig -Name $SubnetName -AddressPrefix $SubnetAddressPrefix
    $Vnet = New-AzVirtualNetwork -Name $NetworkName -ResourceGroupName $ResourceGroupName -Location $LocationName -AddressPrefix $VnetAddressPrefix -Subnet $SingleSubnet    
}
$NIC = New-AzNetworkInterface -Name $NICName -ResourceGroupName $ResourceGroupName -Location $LocationName -SubnetId $Vnet.Subnets[0].Id
$Credential = New-Object System.Management.Automation.PSCredential ($VMLocalAdminUser, $VMLocalAdminSecurePassword);
$VirtualMachine = New-AzVMConfig -VMName $VMName -VMSize $VMSize
$VirtualMachine = Set-AzVMOperatingSystem -VM $VirtualMachine -Windows -ComputerName $ComputerName -Credential $Credential -ProvisionVMAgent -EnableAutoUpdate
$VirtualMachine = Add-AzVMNetworkInterface -VM $VirtualMachine -Id $NIC.Id
$VirtualMachine = Set-AzVMSourceImage -VM $VirtualMachine -PublisherName 'MicrosoftWindowsServer' -Offer 'WindowsServer' -Skus '2019-Datacenter' -Version latest

New-AzVM -ResourceGroupName $ResourceGroupName -Location $LocationName -VM $VirtualMachine -Verbose