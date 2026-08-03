# windows_sync.ps1
# Windows PowerShell equivalent of sync.sh
#
# Usage:
#   .\sync.ps1

Set-Location -Path ".." -ErrorAction Stop

git add -A

$status = git status --porcelain
$changedFiles = ($status | ForEach-Object { ($_ -split '\s+', 3)[2] }) -join ', '

if ([string]::IsNullOrWhiteSpace($changedFiles)) {
    exit 0
}

git commit -m "Updated files: $changedFiles"
git pull --rebase
git push
