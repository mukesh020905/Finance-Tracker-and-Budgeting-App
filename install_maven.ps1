$ErrorActionPreference = "Stop"

# Using a more stable URL from Central Repository
$mavenVersion = "3.9.9"
$mavenUrl = "https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/$mavenVersion/apache-maven-$mavenVersion-bin.zip"
$installDir = "$env:USERPROFILE\maven"
$zipFile = "$env:TEMP\maven.zip"

Write-Host "Downloading Maven $mavenVersion from $mavenUrl..."
try {
    Invoke-WebRequest -Uri $mavenUrl -OutFile $zipFile
}
catch {
    Write-Error "Failed to download Maven. Please check your internet connection or the URL."
    exit 1
}

if (-not (Test-Path $installDir)) {
    New-Item -ItemType Directory -Force -Path $installDir | Out-Null
}

Write-Host "Extracting Maven..."
Expand-Archive -Path $zipFile -DestinationPath $installDir -Force

$mvnHome = "$installDir\apache-maven-$mavenVersion"
$mvnBin = "$mvnHome\bin"

Write-Host "Maven installed at: $mvnHome"
Write-Host "Adding to PATH..."

$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$mvnBin*") {
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;$mvnBin", "User")
    $env:Path += ";$mvnBin"
    Write-Host "Maven added to PATH."
}
else {
    Write-Host "Maven already in PATH."
}

Write-Host "Verifying installation..."
& "$mvnBin\mvn" -version

Write-Host "Installation Complete! Please CLOSE this terminal and OPEN A NEW ONE to use 'mvn'."
