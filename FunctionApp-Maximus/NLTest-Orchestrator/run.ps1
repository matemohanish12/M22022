param($Context)

$output = @()

$output += Invoke-ActivityFunction -FunctionName 'NLTest-FirstActivity' -Input 'Tokyo'
$output += Invoke-ActivityFunction -FunctionName 'NLTest-SecondActivity' -Input 'Seattle'
$output += Invoke-ActivityFunction -FunctionName 'NLTest-ThirdActivity' -Input 'London'

$output
