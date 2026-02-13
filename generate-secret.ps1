# Generate NEXTAUTH_SECRET
Write-Host "Generating a secure NEXTAUTH_SECRET..." -ForegroundColor Green
Write-Host ""

$secret = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

Write-Host "Your NEXTAUTH_SECRET:" -ForegroundColor Yellow
Write-Host $secret -ForegroundColor Cyan
Write-Host ""
Write-Host "Copy this value and add it to your Vercel Environment Variables" -ForegroundColor Green
Write-Host ""
Write-Host "Steps:" -ForegroundColor Yellow
Write-Host "1. Go to your Vercel project settings" -ForegroundColor White
Write-Host "2. Click on 'Environment Variables'" -ForegroundColor White
Write-Host "3. Add a new variable with key: NEXTAUTH_SECRET" -ForegroundColor White
Write-Host "4. Paste the value above" -ForegroundColor White
Write-Host "5. Select all environments (Production, Preview, Development)" -ForegroundColor White
Write-Host "6. Save and redeploy your application" -ForegroundColor White
