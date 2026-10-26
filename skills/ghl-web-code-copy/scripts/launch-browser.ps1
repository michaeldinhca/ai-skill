<#
  Opens a SEPARATE Edge or Chrome window with a debugging port, using its own empty profile
  (not the user's everyday browser). The user logs in to GoHighLevel in that window themselves;
  the other scripts then attach to it. No password ever goes through the assistant.

  usage:  pwsh launch-browser.ps1 -Url "https://go.<white-label-domain>/v2/location/<LOCATION_ID>/funnels-websites/websites/<SITE_ID>/pages"
          [-Port 9222] [-Profile "<folder>"]
#>
param(
  [Parameter(Mandatory = $true)][string]$Url,
  [int]$Port = 9222,
  [string]$Profile = (Join-Path $env:TEMP 'ghl-browser-profile')
)
$candidates = @(
  "$env:ProgramFiles (x86)\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"
)
$exe = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $exe) { throw 'No Edge or Chrome found. Install one, or start a Chromium browser yourself with --remote-debugging-port.' }
New-Item -ItemType Directory -Force $Profile | Out-Null
Start-Process $exe -ArgumentList "--remote-debugging-port=$Port", "--user-data-dir=$Profile", '--no-first-run', '--no-default-browser-check', '--window-size=1500,950', $Url | Out-Null
Start-Sleep 4
try {
  $v = Invoke-RestMethod "http://127.0.0.1:$Port/json/version" -TimeoutSec 10
  Write-Output "Debug port $Port is up ($($v.Browser)). Ask the user to log in, then continue."
} catch {
  Write-Output "Debug port $Port is NOT reachable: $($_.Exception.Message)"
}
