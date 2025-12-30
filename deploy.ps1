# Joia Karaoke - Deployment Helper Script
# Run this script to prepare for Coolify deployment

Write-Host "🚀 Joia Karaoke Deployment Helper" -ForegroundColor Cyan
Write-Host ""

# Check if git remote exists
$remote = git remote get-url origin 2>$null

if ($remote) {
    Write-Host "✅ Git remote found: $remote" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ready to push! Run:" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor White
} else {
    Write-Host "⚠️  No GitHub remote configured" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Steps to deploy:" -ForegroundColor Cyan
    Write-Host "1. Create a new repository on GitHub" -ForegroundColor White
    Write-Host "2. Run: git remote add origin https://github.com/YOUR_USERNAME/joia-karaoke.git" -ForegroundColor White
    Write-Host "3. Run: git branch -M main" -ForegroundColor White
    Write-Host "4. Run: git push -u origin main" -ForegroundColor White
    Write-Host ""
    Write-Host "Then follow DEPLOY_NOW.md for Coolify setup" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Push to GitHub (see above)" -ForegroundColor White
Write-Host "2. Deploy backend in Coolify (follow DEPLOY_NOW.md)" -ForegroundColor White
Write-Host "3. Deploy frontend in Coolify" -ForegroundColor White
Write-Host "4. Update backend FRONTEND_URL env var" -ForegroundColor White
Write-Host "5. Test with a YouTube URL" -ForegroundColor White

