# 🚀 Vercel Deployment Guide - NIT Kurukshetra Crowdfunding

## Prerequisites
- GitHub account
- Vercel account (free)
- Your project pushed to GitHub

## Deployment Options

### Option 1: Demo Mode (Recommended for Showcase)
Deploy the frontend with mock data - perfect for presentations and demos.

### Option 2: Testnet Integration
Deploy with real blockchain integration using test networks.

## Step-by-Step Deployment

### 1. Prepare Your Repository
```bash
# Ensure your code is committed and pushed to GitHub
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Build Test (Optional but Recommended)
```bash
cd client
npm run build
```

### 3. Deploy to Vercel

#### Method A: Vercel Dashboard (Easiest)
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### Method B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to client directory
cd client

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: nit-kurukshetra-crowdfunding
# - Directory: ./
```

### 4. Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

#### For Demo Mode:
```
VITE_DEMO_MODE = true
```

#### For Testnet Integration:
```
VITE_NETWORK_NAME = Polygon Mumbai
VITE_CHAIN_ID = 80001
VITE_RPC_URL = https://rpc-mumbai.maticvigil.com
VITE_CONTRACT_ADDRESS = your_deployed_contract_address
```

### 5. Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS settings

## Post-Deployment Checklist

- [ ] Landing page loads correctly
- [ ] All routes work (thanks to SPA routing)
- [ ] Mobile responsiveness
- [ ] MetaMask connection (if using blockchain)
- [ ] All features functional

## Deployment URLs

After deployment, you'll get:
- **Production URL**: `https://your-project.vercel.app`
- **Preview URLs**: For each commit/branch

## Demo Mode Features

When `VITE_DEMO_MODE=true`:
- Mock campaign data
- Simulated transactions
- All UI/UX functionality
- No MetaMask required
- Perfect for presentations

## Blockchain Integration

### Testnet Deployment
1. Deploy contracts to Polygon Mumbai
2. Update contract address in environment variables
3. Users need Mumbai testnet tokens (free from faucets)

### Mainnet Deployment (Production)
1. Deploy contracts to Polygon Mainnet
2. Update environment variables
3. Real ETH/MATIC required

## Troubleshooting

### Build Errors
```bash
# Check for unused imports
npm run build

# Fix any ESLint warnings
```

### Routing Issues
- Ensure `vercel.json` is configured for SPA routing

### Environment Variables
- Use `VITE_` prefix for Vite projects
- Restart deployment after adding variables

## Performance Optimization

### Already Included:
- Vite bundling and optimization
- Tree shaking
- Code splitting
- Asset optimization

### Additional Optimizations:
- Image optimization (Vercel automatic)
- CDN distribution (Vercel automatic)
- Gzip compression (Vercel automatic)

## Security Considerations

- Environment variables are secure in Vercel
- No private keys in frontend code
- HTTPS by default
- XSS protection headers

## Cost

- **Vercel Free Tier**: Perfect for this project
- **100GB bandwidth/month**
- **Custom domains included**
- **Automatic HTTPS**

## Monitoring

Vercel provides:
- Analytics
- Performance insights
- Error tracking
- Deployment logs

## Quick Commands

```bash
# Redeploy
vercel --prod

# Check deployments
vercel ls

# View logs
vercel logs
```

## Demo URLs to Share

After deployment, you can share:
- **Live Demo**: Your Vercel URL
- **GitHub Repo**: Source code
- **Documentation**: This guide

Perfect for:
- Portfolio showcase
- Academic presentations
- Client demonstrations
- Job interviews

## 🎉 Your NIT Kurukshetra Crowdfunding Platform is now live on Vercel!