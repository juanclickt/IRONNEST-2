# IronNest Installations - Deployment Guide

## Vercel Deployment Steps

### 1. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login with GitHub
2. Connect your GitHub account
3. Import this project from GitHub
4. Vercel will automatically detect the configuration and deploy

### 2. Database Setup (Free)
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new database project
3. Copy the connection string
4. In Vercel dashboard, go to your project settings
5. Add environment variable: `DATABASE_URL` with your Neon connection string

### 3. Custom Domain Setup
1. In Vercel dashboard, go to your project
2. Go to Settings > Domains
3. Add both domains:
   - `ironnest.co.za`
   - `www.ironnest.co.za`

### 4. GoDaddy DNS Configuration
In your GoDaddy domain management, update these DNS records:

**A Record:**
- Type: A
- Host: @
- Points to: 76.76.19.61

**CNAME Record:**
- Type: CNAME
- Host: www
- Points to: cname.vercel-dns.com

### 5. Admin Access
Once deployed, your client can access:
- Website: `https://ironnest.co.za`
- Admin Dashboard: `https://ironnest.co.za/admin`
- Login: Username: `Admin`, Password: `IronNest2025`

### 6. Database Migration
After deployment, run this command to set up the database:
```bash
npm run db:push
```

## What Your Client Gets
- Professional website at ironnest.co.za
- Admin dashboard at ironnest.co.za/admin
- Contact and booking form management
- Mobile-responsive design
- SEO optimization for Cape Town searches
- Free hosting with Vercel
- Automatic SSL certificates

## Support
All forms submit to the admin dashboard - no email setup required!