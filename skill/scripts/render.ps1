<#
  clippyslide :: render
  HTML slide(s) -> PNG via Edge headless. Encodes the working invocation discovered
  during the CoE build: isolated --user-data-dir (Edge is usually already running),
  $PWD-absolute --screenshot path, URL-encoded file:/// path, 2x device scale.

  Usage:
    .\render.ps1 -Path "C:\...\slides\01-title.html"
    .\render.ps1 -Path "C:\...\slides" -All        # render every *.html in a folder
    .\render.ps1 -Path slide.html -Width 1280 -Height 720 -Scale 2
#>
param(
  [Parameter(Mandatory=$true)][string]$Path,
  [switch]$All,
  [int]$Width = 1280,
  [int]$Height = 720,
  [int]$Scale = 2,
  [string]$Edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
)

if (-not (Test-Path $Edge)) { throw "Edge not found at $Edge" }

function Convert-ToFileUri([string]$abs) {
  # URL-encode each path segment so spaces (OneDrive - Microsoft) survive
  $u = "file:///" + ($abs -replace '\\','/')
  $u = $u -replace ' ','%20'
  return $u
}

function Render-One([string]$html) {
  $abs = (Resolve-Path $html).Path
  $png = [System.IO.Path]::ChangeExtension($abs, ".png")
  $uri = Convert-ToFileUri $abs
  $tmp = Join-Path $env:TEMP ("clippyslide-" + [System.Guid]::NewGuid().ToString("N"))
  & $Edge --headless=new --disable-gpu --no-first-run --no-sandbox `
          --user-data-dir="$tmp" --hide-scrollbars --force-device-scale-factor=$Scale `
          --window-size="$Width,$Height" --screenshot="$png" $uri 2>$null
  Start-Sleep 2
  Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
  if (Test-Path $png) { Write-Output "OK  $png  ($((Get-Item $png).Length) bytes)" }
  else { Write-Output "FAIL $html" }
}

if ($All) {
  Get-ChildItem -Path $Path -Filter *.html | ForEach-Object { Render-One $_.FullName }
} else {
  Render-One $Path
}
