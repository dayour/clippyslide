<#
  clippyslide :: pptx-to-png
  Render a reference .pptx to per-slide PNGs via the PowerPoint COM automation
  (LibreOffice is NOT assumed present). Used to capture originals for visual QA.

  Usage:
    .\pptx-to-png.ps1 -Pptx "C:\...\coe.pptx" -OutDir "C:\...\coe-render"

  Tip: if the source is open/locked, copy it to a scratch path first.
#>
param(
  [Parameter(Mandatory=$true)][string]$Pptx,
  [Parameter(Mandatory=$true)][string]$OutDir,
  [int]$Width = 1280,
  [int]$Height = 720
)
$src = (Resolve-Path $Pptx).Path
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$ppt = New-Object -ComObject PowerPoint.Application
$pres = $ppt.Presentations.Open($src, $true, $false, $false)   # ReadOnly, Untitled, WithWindow=false
$i = 0
foreach ($slide in $pres.Slides) {
  $i++
  $out = Join-Path $OutDir ("slide{0:D2}.png" -f $i)
  $slide.Export($out, "PNG", $Width, $Height)
}
$pres.Close()
$ppt.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($ppt) | Out-Null
Write-Output "Rendered $i slides to $OutDir"
