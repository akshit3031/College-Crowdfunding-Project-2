# 🚀 Vercel Configuration Guide

## Vercel Dashboard Settings

### 1. Import Project
- Go to vercel.com
- Click "New Project"
- Import from GitHub: `College-Crowdfunding-Project-2`

### 2. Configure Build Settings

#### Framework Detection
- **Framework Preset**: `Vite` (should auto-detect)

#### Project Settings
- **Root Directory**: `client` ⭐ IMPORTANT!
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Output Directory**: `dist`
- **Node.js Version**: `18.x`

#### Advanced Settings (if needed)
- **Function Region**: `Washington, D.C., USA (iad1)` (default)
- **Compatible with**: `Edge Runtime`

## Environment Variables (Optional)

Add these in Vercel Dashboard → Settings → Environment Variables:

### For Demo Mode (Recommended)
```
VITE_DEMO_MODE = true
```

### For Blockchain Integration (Advanced)
```
VITE_NETWORK_NAME = Polygon Mumbai
VITE_CHAIN_ID = 80001
VITE_RPC_URL = https://rpc-mumbai.maticvigil.com
VITE_CONTRACT_ADDRESS = your_contract_address_here
```

## Build Configuration Verification

Your `client/package.json` should have:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

Your `client/vite.config.js` should exist and be configured properly.

## Troubleshooting Build Issues

### Common Problems & Solutions:

1. **Build fails with "command not found"**
   - Solution: Ensure Root Directory is set to `client`

2. **Output directory not found**
   - Solution: Verify Output Directory is set to `dist`

3. **Environment variable issues**
   - Solution: Use `VITE_` prefix for all env vars

4. **Routing issues (404 on refresh)**
   - Solution: Vercel.json should handle SPA routing (already created)

## Expected Build Output
```
✓ Build completed successfully
✓ Static files generated in dist/
✓ Deployment URL: https://your-project.vercel.app
```

## Post-Deployment Checklist
- [ ] Landing page loads
- [ ] All routes work (no 404s)
- [ ] Mobile responsive
- [ ] Images and assets load
- [ ] Console shows no critical errors