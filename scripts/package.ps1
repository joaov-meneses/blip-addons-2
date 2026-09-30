$ErrorActionPreference = 'Stop'
$taskRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$taskDist = Join-Path $taskRoot 'dist'
$taskRelease = Join-Path $taskRoot 'release'
if (-not (Test-Path -LiteralPath (Join-Path $taskDist 'manifest.json'))) { throw 'Execute npm run build antes de empacotar.' }
New-Item -ItemType Directory -Force -Path $taskRelease | Out-Null
$taskVersion = (Get-Content -Raw -LiteralPath (Join-Path $taskDist 'manifest.json') | ConvertFrom-Json).version
$taskInstallZip = Join-Path $taskRelease ('Blip-Addons-' + $taskVersion + '.zip')
$taskSourceZip = Join-Path $taskRelease ('Blip-Addons-' + $taskVersion + '-fonte.zip')
Compress-Archive -Path (Join-Path $taskDist '*') -DestinationPath $taskInstallZip -Force
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
$taskHashes = @($taskInstallZip, $taskSourceZip) | ForEach-Object {
  $taskHash = Get-FileHash -LiteralPath $_ -Algorithm SHA256
  '{0}  {1}' -f $taskHash.Hash.ToLowerInvariant(), [IO.Path]::GetFileName($_)
}
$taskHashes | Set-Content -Encoding ASCII -LiteralPath (Join-Path $taskRelease 'SHA256SUMS.txt')
Get-Item -LiteralPath $taskInstallZip, $taskSourceZip | Select-Object Name, Length
