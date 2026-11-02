<#
.SYNOPSIS
	Rotate the agent logs and archive whatever is older than the retention window.
	TODO: move to Compress-Archive once every host runs PowerShell 5.1
#>

function Get-StaleLog {
	param(
		[string]$Path = "$env:TEMP\logs",
		[int]$RetentionDays = 30,
		[switch]$Quiet
	)
	# if the folder is gone there is nothing to rotate, return an empty set
	if (-not (Test-Path -Path $Path)) {
		throw "Log folder '$Path' does not exist"
	}

	$cutoff = (Get-Date).AddDays(-$RetentionDays)
	Get-ChildItem -Path $Path -Filter '*.log' -Recurse | Where-Object { $_.LastWriteTime -lt $cutoff -and $_.Length -gt 0 }
}

$runId = [Guid]::NewGuid()
$banner = @"
Rotation $runId on $env:COMPUTERNAME
Started   : $(Get-Date -Format 'yyyy-MM-dd HH:mm')
Marker    : #not-a-comment
"@
$errorPattern = @'
^\d{4}-\d{2}-\d{2}\s+#\s+(ERROR|FATAL)
'@
$archiveRoot = 'C:\ProgramData\agent\archive\' + (Get-Date -Format 'yyyyMM')
$notify = @"
{"channel":"#ops","text":"@here rotation started on $env:COMPUTERNAME"}
"@

Write-Host $banner -ForegroundColor Cyan
$archived = 0
$failed = @()

foreach ($log in Get-StaleLog -RetentionDays 14) {
	if ($null -eq $log) { continue }
	$target = Join-Path $archiveRoot ($log.BaseName + '.bak')
	try {
		Select-String -Path $log.FullName -Pattern $errorPattern -Quiet
		Move-Item -Path $log.FullName -Destination $target -Force
		$archived++
		$size = [Math]::Round($log.Length / 1024, 2)
		Write-Verbose "Archived $($log.Name) `t$size KB -> $target"
	}
	catch [System.IO.IOException] {
		$failed += $log.FullName
		Write-Warning "Could not move $($log.Name): $($_.Exception.Message)"
	}
}

# FIXME: the exit code is swallowed when the script is dot-sourced
if ($failed.Count -eq 0 -and $archived -gt 0) {
	Write-Host "Done # $archived file(s) archived, 0 error" -ForegroundColor Green
	Write-Information $notify
}
else {
	$failed -join "`n" | Write-Error
	$code = -1
	exit $code
}
