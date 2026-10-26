<#
  Read what a PUBLISHED page really outputs, bypassing GHL's short cache.
  Use it after every Publish, and before claiming a page is done.

  usage:  pwsh check_live.ps1 -Url "https://example.com/fr/thank-you" [-Expect "text that must be in the body"]

  Reports: <html lang>, whether the global header/footer are present, title, description, robots, canonical,
  hreflang, geo, Open Graph, Twitter, JSON-LD count, and duplicate tags.
  GHL caches published pages for about 60 seconds, so an "old" result right after Publish can just mean wait and run again.
#>
param([Parameter(Mandatory = $true)][string]$Url, [string]$Expect = '')
$ProgressPreference = 'SilentlyContinue'
$sep = if ($Url.Contains('?')) { '&' } else { '?' }
$h = (Invoke-WebRequest "$Url$sep`nocache=$(Get-Random)" -UseBasicParsing -TimeoutSec 40 -Headers @{ 'Cache-Control' = 'no-cache' }).Content
$i = $h.IndexOf('</head>'); $head = if ($i -gt 0) { $h.Substring(0, $i) } else { $h }
Write-Output ("html tag       : " + [regex]::Match($h, '<html[^>]*>').Value)
Write-Output ("global sections: header=" + $h.Contains('aca-header') + "  footer=" + $h.Contains('aca-footer') + "   (rename the class names for another site)")
if ($Expect) { Write-Output ("expected text  : " + $h.Contains($Expect)) }
$pats = '<title>[^<]*</title>', '<meta name="description"[^>]*>', '<meta name="robots"[^>]*>', '<link rel="canonical"[^>]*>', '<link rel="alternate"[^>]*hreflang[^>]*>',
        '<meta name="language"[^>]*>', '<meta name="geo\.[^>]*>', '<meta name="ICBM"[^>]*>', '<meta property="og:[^>]*>', '<meta name="twitter:[^>]*>', '<meta name="theme-color"[^>]*>'
foreach ($p in $pats) { [regex]::Matches($head, $p) | ForEach-Object { "  " + $_.Value.Substring(0, [Math]::Min(170, $_.Value.Length)) } }
Write-Output ("JSON-LD blocks : " + [regex]::Matches($h, 'application/ld\+json').Count)
foreach ($n in 'name="robots"', 'rel="canonical"', 'og:title', 'og:image', 'name="description"') {
  $c = [regex]::Matches($head, [regex]::Escape($n)).Count
  if ($c -gt 1) { Write-Output "DUPLICATE: $n appears $c times" }
}
