# Zip the generated dist outputs into shareable archives.
# Usage: pwsh scripts/zip-dist.ps1
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$dist = Join-Path $root "dist"

$targets = @{
  "ux-sting-qoder-plugin"  = Join-Path $dist "ux-sting"
  "ux-sting-skills-bundle" = Join-Path $dist "skills-bundle"
}

foreach ($name in $targets.Keys) {
  $src = $targets[$name]
  if (-not (Test-Path $src)) { Write-Warning "missing $src"; continue }
  $zip = Join-Path $dist "$name.zip"
  if (Test-Path $zip) { Remove-Item $zip -Force }
  # Compress-Archive zips the *contents* of $src at the archive root.
  Compress-Archive -Path (Join-Path $src "*") -DestinationPath $zip
  Write-Host "zipped -> $zip"
}
