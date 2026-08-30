# Seed script for BCM backend (PowerShell)
# Usage: pwsh -ExecutionPolicy Bypass -File .\seed.ps1

$base = 'http://localhost:3000'

Write-Host "Checking API at $base..."
$tries = 0
while ($tries -lt 20) {
    try {
        Invoke-RestMethod -Uri "$base/users" -Method GET -TimeoutSec 5 | Out-Null
        Write-Host "API reachable"
        break
    } catch {
        Write-Host "Waiting for API... ($tries)"
        Start-Sleep -Seconds 2
        $tries++
    }
}
if ($tries -ge 20) { Write-Error "API not reachable at $base. Start the server and retry."; exit 1 }

function PostJson($path, $obj) {
    $url = "$base/$path"
    $body = $obj | ConvertTo-Json -Depth 10
    try {
        $res = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType 'application/json'
        Write-Host "POST $path -> created id: $($res.id)"
        return $res
    } catch {
        Write-Host "POST $path -> ERROR: $($_.Exception.Message)"
        return $null
    }
}

function EnsurePost($path, $obj, $uniqueKey) {
    $url = "$base/$path"
    $existing = @()
    try { $existing = Invoke-RestMethod -Uri $url -Method GET -TimeoutSec 5 } catch { $existing = @() }
    $found = $null
    if ($existing -is [System.Array]) {
        foreach ($e in $existing) {
            if ($e.$uniqueKey -eq $obj.$uniqueKey) { $found = $e; break }
        }
    } elseif ($existing) {
        if ($existing.$uniqueKey -eq $obj.$uniqueKey) { $found = $existing }
    }
    if ($found) { Write-Host "SKIP $path -> exists id: $($found.id)"; return $found }
    return PostJson $path $obj
}

# Services
$services = @(
    @{ service_id = 'SVC-001'; name = 'Customer Portal'; description = 'Online portal for customers'; service_category = 'Customer-facing'; business_function = 'Sales'; criticality_rating = 'High' },
    @{ service_id = 'SVC-002'; name = 'Billing Engine'; description = 'Invoice generation and processing'; service_category = 'Financial'; business_function = 'Finance'; criticality_rating = 'Critical' },
    @{ service_id = 'SVC-003'; name = 'Internal HR System'; description = 'Employee records and payroll'; service_category = 'Internal'; business_function = 'HR'; criticality_rating = 'Medium' }
)
foreach ($s in $services) { EnsurePost 'services' $s 'service_id' | Out-Null; Start-Sleep -Milliseconds 300 }

# Risks
$risks = @(
    @{ title = 'Ransomware attack on primary datacenter'; category = 'Ransomware'; description = 'Encryption of production systems'; likelihood = 'Possible'; impact = 'High' },
    @{ title = 'Cloud provider outage'; category = 'Cloud Outage'; description = 'Major cloud region failure'; likelihood = 'Unlikely'; impact = 'Critical' }
)
foreach ($r in $risks) { EnsurePost 'risks' $r 'title' | Out-Null; Start-Sleep -Milliseconds 300 }

# Recovery Plans
$plans = @(
    @{ name = 'Customer Portal DR Plan'; service_id = 'SVC-001'; recovery_team = @('portal-ops'); trigger_events = @('datacenter_failure'); recovery_objectives = @{ RTO = '4h'; RPO = '1h' } },
    @{ name = 'Billing Engine DR Plan'; service_id = 'SVC-002'; recovery_team = @('billing-ops'); trigger_events = @('ransomware'); recovery_objectives = @{ RTO = '24h'; RPO = '4h' } }
)
foreach ($p in $plans) { EnsurePost 'recovery-plans' $p 'name' | Out-Null; Start-Sleep -Milliseconds 300 }

# Documents
$docs = @(
    @{ doc_key = 'BCP-001'; title = 'Business Continuity Policy'; description = 'Top-level BCM policy'; doc_type = 'Policy' },
    @{ doc_key = 'DR-Runbook-Portal'; title = 'Portal Runbook'; description = 'Runbook for restoring Customer Portal'; doc_type = 'Runbook' }
)
foreach ($d in $docs) { EnsurePost 'documents' $d 'doc_key' | Out-Null; Start-Sleep -Milliseconds 300 }

Write-Host "Seeding complete. Verify with: GET $base/services , GET $base/risks , GET $base/recovery-plans , GET $base/documents"