$ErrorActionPreference = 'Stop'
$taskRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$taskDist = Join-Path $taskRoot 'dist'
$taskRelease = Join-Path $taskRoot 'release'
$taskInstallation = Join-Path $taskRoot 'instalacao'
if (-not (Test-Path -LiteralPath (Join-Path $taskDist 'manifest.json'))) { throw 'Execute npm run build antes de empacotar.' }
New-Item -ItemType Directory -Force -Path $taskRelease | Out-Null
New-Item -ItemType Directory -Force -Path $taskInstallation | Out-Null
$taskVersion = (Get-Content -Raw -LiteralPath (Join-Path $taskDist 'manifest.json') | ConvertFrom-Json).version
$taskInstallZip = Join-Path $taskRelease ('Blip-Addons-' + $taskVersion + '.zip')
$taskEasyInstallZip = Join-Path $taskInstallation ('Blip-Addons-' + $taskVersion + '.zip')
$taskSourceZip = Join-Path $taskRelease ('Blip-Addons-' + $taskVersion + '-fonte.zip')
$taskDistEntries = @(Get-ChildItem -LiteralPath $taskDist -Force | ForEach-Object { $_.Name })
& tar.exe -a -cf $taskInstallZip -C $taskDist @taskDistEntries
if ($LASTEXITCODE -ne 0) { throw 'Falha ao empacotar a extensão.' }
& tar.exe -a -cf $taskEasyInstallZip -C $taskRoot 'dist'
if ($LASTEXITCODE -ne 0) { throw 'Falha ao empacotar a instalação facilitada.' }
$taskSourceFiles = @('src', 'static', 'vendor', 'scripts', 'tests', 'docs', 'package.json', 'package-lock.json', 'tsconfig.json', 'webpack.config.js', 'README.md', 'THIRD_PARTY_NOTICES.md')
& tar.exe -a -cf $taskSourceZip -C $taskRoot @taskSourceFiles
if ($LASTEXITCODE -ne 0) { throw 'Falha ao empacotar o projeto-fonte.' }
Add-Type -AssemblyName System.IO.Compression.FileSystem
$taskArchive = [IO.Compression.ZipFile]::OpenRead($taskInstallZip)
try {
  if (-not ($taskArchive.Entries | Where-Object { $_.FullName -eq 'manifest.json' })) { throw 'Manifesto ausente na raiz do ZIP.' }
  $taskExpectedCount = (Get-ChildItem -LiteralPath $taskDist -Recurse -File).Count
  $taskActualCount = @($taskArchive.Entries | Where-Object { $_.Name }).Count
  if ($taskExpectedCount -ne $taskActualCount) { throw 'Quantidade de arquivos do pacote diverge do build.' }
} finally { $taskArchive.Dispose() }
$taskEasyArchive = [IO.Compression.ZipFile]::OpenRead($taskEasyInstallZip)
try {
  if (-not ($taskEasyArchive.Entries | Where-Object { $_.FullName -eq 'dist/manifest.json' })) { throw 'Manifesto ausente na pasta dist do ZIP de instalação.' }
  $taskEasyCount = @($taskEasyArchive.Entries | Where-Object { $_.Name }).Count
  if ($taskExpectedCount -ne $taskEasyCount) { throw 'Quantidade de arquivos do ZIP de instalação diverge do build.' }
} finally { $taskEasyArchive.Dispose() }
$taskHashes = @($taskInstallZip, $taskSourceZip) | ForEach-Object {
  $taskHash = Get-FileHash -LiteralPath $_ -Algorithm SHA256
  '{0}  {1}' -f $taskHash.Hash.ToLowerInvariant(), [IO.Path]::GetFileName($_)
}
$taskHashes | Set-Content -Encoding ASCII -LiteralPath (Join-Path $taskRelease 'SHA256SUMS.txt')
$taskEasyHash = Get-FileHash -LiteralPath $taskEasyInstallZip -Algorithm SHA256
('{0}  {1}' -f $taskEasyHash.Hash.ToLowerInvariant(), [IO.Path]::GetFileName($taskEasyInstallZip)) |
  Set-Content -Encoding ASCII -LiteralPath (Join-Path $taskInstallation 'SHA256SUMS.txt')
Get-Item -LiteralPath $taskEasyInstallZip, $taskInstallZip, $taskSourceZip | Select-Object Name, Length
