param(
  [Parameter(Mandatory=$true)][string]$Source,
  [Parameter(Mandatory=$true)][string]$Output,
  [Parameter(Mandatory=$true)][string]$DeckId,
  [Parameter(Mandatory=$true)][string]$SyntheticTitle,
  [switch]$SkipExport
)

$ErrorActionPreference = 'Stop'
$Source = (Resolve-Path $Source).Path
$Output = [IO.Path]::GetFullPath((Join-Path $PWD $Output))
$previewDir = Join-Path $Output 'source-previews'
New-Item -ItemType Directory -Force -Path $Output,$previewDir | Out-Null

function Try-Value([scriptblock]$Block, $Default=$null) {
  try { & $Block } catch { $Default }
}

function To-HexColor($Rgb) {
  if ($null -eq $Rgb) { return $null }
  $v = [int64]$Rgb -band 0xFFFFFF
  $r = $v -band 0xff
  $g = ($v -shr 8) -band 0xff
  $b = ($v -shr 16) -band 0xff
  return ('#{0:X2}{1:X2}{2:X2}' -f $r,$g,$b)
}

function Normalize-Text([string]$Text) {
  if ($null -eq $Text) { return '' }
  return (($Text -replace "`r",' ' -replace "`n",' ' -replace '\s+',' ').Trim())
}

$ppt = New-Object -ComObject PowerPoint.Application
$pres = $null
try {
  $pres = $ppt.Presentations.Open($Source,$true,$true,$false)
  $slideWidth = [double]$pres.PageSetup.SlideWidth
  $slideHeight = [double]$pres.PageSetup.SlideHeight
  $slides = [System.Collections.Generic.List[object]]::new()

  foreach ($slide in $pres.Slides) {
    $n = [int]$slide.SlideIndex
    $slideId = 'slide-{0:D3}' -f $n
    $preview = Join-Path $previewDir ('{0:D3}.png' -f $n)
    if (-not $SkipExport) { $slide.Export($preview,'PNG',1280,720) }

    $elements = [System.Collections.Generic.List[object]]::new()
    $textBlocks = [System.Collections.Generic.List[string]]::new()
    $shapeTypeCounts = @{}
    $pictureCount = 0
    $mediaCount = 0
    $chartCount = 0
    $tableCount = 0

    foreach ($shape in $slide.Shapes) {
      $type = [int](Try-Value { $shape.Type } -1)
      $typeKey = [string]$type
      if (-not $shapeTypeCounts.ContainsKey($typeKey)) { $shapeTypeCounts[$typeKey] = 0 }
      $shapeTypeCounts[$typeKey] += 1
      if ($type -eq 13) { $pictureCount += 1 }
      if ($type -eq 16) { $mediaCount += 1 }
      if ((Try-Value { $shape.HasChart } 0) -eq -1) { $chartCount += 1 }
      if ((Try-Value { $shape.HasTable } 0) -eq -1) { $tableCount += 1 }

      $text = ''
      if ((Try-Value { $shape.HasTextFrame } 0) -eq -1) {
        if ((Try-Value { $shape.TextFrame.HasText } 0) -eq -1) {
          $text = Normalize-Text (Try-Value { $shape.TextFrame.TextRange.Text } '')
          if ($text) { $textBlocks.Add($text) }
        }
      }
      $font = $null
      if ($text) {
        $range = Try-Value { $shape.TextFrame.TextRange } $null
        if ($null -ne $range) {
          $font = [ordered]@{
            family = Try-Value { [string]$range.Font.Name } ''
            sizePt = Try-Value { [double]$range.Font.Size } 0
            bold = (Try-Value { [int]$range.Font.Bold } 0) -eq -1
            italic = (Try-Value { [int]$range.Font.Italic } 0) -eq -1
            color = To-HexColor (Try-Value { $range.Font.Color.RGB } $null)
          }
        }
      }
      $left = [double](Try-Value { $shape.Left } 0)
      $top = [double](Try-Value { $shape.Top } 0)
      $width = [double](Try-Value { $shape.Width } 0)
      $height = [double](Try-Value { $shape.Height } 0)
      $fillVisible = (Try-Value { [int]$shape.Fill.Visible } 0) -eq -1
      $lineVisible = (Try-Value { [int]$shape.Line.Visible } 0) -eq -1

      $elements.Add([ordered]@{
        id = ('s{0:D3}-shape-{1:D3}' -f $n,[int]$shape.Id)
        sourceId = [int](Try-Value { $shape.Id } 0)
        name = [string](Try-Value { $shape.Name } '')
        kind = if ($type -eq 13) {'picture'} elseif ($type -eq 16) {'video'} elseif ((Try-Value { $shape.HasChart } 0) -eq -1) {'chart'} elseif ((Try-Value { $shape.HasTable } 0) -eq -1) {'table'} elseif ($text) {'text'} else {'shape'}
        sourceType = $type
        role = if ($text -and $elements.Count -eq 0) {'title-candidate'} elseif ($text) {'body'} else {'visual'}
        bounds = [ordered]@{
          x = [math]::Round($left / $slideWidth * 1280,2)
          y = [math]::Round($top / $slideHeight * 720,2)
          w = [math]::Round($width / $slideWidth * 1280,2)
          h = [math]::Round($height / $slideHeight * 720,2)
        }
        sourceBoundsPt = [ordered]@{ x=$left; y=$top; w=$width; h=$height }
        rotation = [double](Try-Value { $shape.Rotation } 0)
        zOrder = [int](Try-Value { $shape.ZOrderPosition } 0)
        text = $text
        font = $font
        altText = [string](Try-Value { $shape.AlternativeText } '')
        fill = if ($fillVisible) { [ordered]@{ color=To-HexColor (Try-Value { $shape.Fill.ForeColor.RGB } $null); transparency=[double](Try-Value { $shape.Fill.Transparency } 0); type=[int](Try-Value { $shape.Fill.Type } 0) } } else { $null }
        line = if ($lineVisible) { [ordered]@{ color=To-HexColor (Try-Value { $shape.Line.ForeColor.RGB } $null); transparency=[double](Try-Value { $shape.Line.Transparency } 0); weight=[double](Try-Value { $shape.Line.Weight } 0) } } else { $null }
        placeholderType = [int](Try-Value { $shape.PlaceholderFormat.Type } 0)
        connector = if ((Try-Value { [int]$shape.Connector } 0) -eq -1) { [ordered]@{
          beginConnected = (Try-Value { [int]$shape.ConnectorFormat.BeginConnected } 0) -eq -1
          beginShapeId = [int](Try-Value { $shape.ConnectorFormat.BeginConnectedShape.Id } 0)
          endConnected = (Try-Value { [int]$shape.ConnectorFormat.EndConnected } 0) -eq -1
          endShapeId = [int](Try-Value { $shape.ConnectorFormat.EndConnectedShape.Id } 0)
          connectorType = [int](Try-Value { $shape.ConnectorFormat.Type } 0)
        } } else { $null }
        media = if ($type -eq 16) { [ordered]@{
          durationMs = [int](Try-Value { $shape.MediaFormat.Length } 0)
          startMs = [int](Try-Value { $shape.MediaFormat.StartPoint } 0)
          endMs = [int](Try-Value { $shape.MediaFormat.EndPoint } 0)
          muted = (Try-Value { [int]$shape.MediaFormat.Muted } 0) -eq -1
        } } else { $null }
        confidence = 1.0
      })
    }

    $title = ''
    foreach ($candidate in $textBlocks) {
      if ($candidate.Length -gt 2) { $title = $candidate; break }
    }
    if (-not $title) { $title = "Slide $n" }
    if ($title.Length -gt 180) { $title = $title.Substring(0,180) }
    $notes = ''
    try {
      foreach ($noteShape in $slide.NotesPage.Shapes) {
        if ((Try-Value { $noteShape.HasTextFrame } 0) -eq -1 -and (Try-Value { $noteShape.TextFrame.HasText } 0) -eq -1) {
          $candidate = Normalize-Text $noteShape.TextFrame.TextRange.Text
          if ($candidate -and $candidate -notmatch '^\d+$') { $notes += $(if($notes){' '}else{''}) + $candidate }
        }
      }
    } catch {}

    $slides.Add([ordered]@{
      id = $slideId
      number = $n
      sourceSlideId = [int](Try-Value { $slide.SlideID } 0)
      title = $title
      hidden = (Try-Value { [int]$slide.SlideShowTransition.Hidden } 0) -eq -1
      transition = [ordered]@{
        entryEffect = [int](Try-Value { $slide.SlideShowTransition.EntryEffect } 0)
        durationSeconds = [double](Try-Value { $slide.SlideShowTransition.Duration } 0)
        advanceOnTime = (Try-Value { [int]$slide.SlideShowTransition.AdvanceOnTime } 0) -eq -1
        advanceTimeSeconds = [double](Try-Value { $slide.SlideShowTransition.AdvanceTime } 0)
      }
      animationCount = [int](Try-Value { $slide.TimeLine.MainSequence.Count } 0)
      notes = $notes
      preview = "source-previews/{0:D3}.png" -f $n
      counts = [ordered]@{ shapes=$elements.Count; pictures=$pictureCount; media=$mediaCount; charts=$chartCount; tables=$tableCount; textBlocks=$textBlocks.Count }
      shapeTypes = $shapeTypeCounts
      textBlocks = @($textBlocks)
      elements = @($elements)
    })
  }

  $props = [ordered]@{}
  foreach ($name in 'Title','Subject','Author','Last Author','Company','Category','Keywords','Comments','Revision Number','Creation Date','Last Save Time') {
    $props[$name] = Try-Value { $pres.BuiltInDocumentProperties.Item($name).Value } $null
  }
  $inventory = [ordered]@{
    schemaVersion = '1.0.0'
    harvestId = $DeckId
    source = [ordered]@{
      name = [IO.Path]::GetFileName($Source)
      path = $Source
      sha256 = (Get-FileHash $Source -Algorithm SHA256).Hash.ToLowerInvariant()
      sizeBytes = (Get-Item $Source).Length
      authorized = $true
      classification = 'internal'
    }
    presentation = [ordered]@{
      name = [string]$pres.Name
      slideCount = [int]$pres.Slides.Count
      widthPt = $slideWidth
      heightPt = $slideHeight
      aspectRatio = [math]::Round($slideWidth/$slideHeight,4)
      syntheticTitle = $SyntheticTitle
      properties = $props
    }
    slides = @($slides)
  }
  $inventory | ConvertTo-Json -Depth 20 | Set-Content -Encoding utf8 (Join-Path $Output 'source-inventory.json')
  Write-Host "Harvested $($slides.Count) slides to $Output"
}
finally {
  if ($null -ne $pres) { $pres.Close() }
  $ppt.Quit()
  [Runtime.InteropServices.Marshal]::ReleaseComObject($ppt) | Out-Null
}
