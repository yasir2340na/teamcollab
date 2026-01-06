# 🚀 TeamCollab Deployment Guide

Complete step-by-step guide to deploy your TeamCollab application to production.

---

## 📋 Pre-Deployment Checklist

### ✅ What You'll Need:
- [ ] MongoDB Atlas account (free tier available)
- [ ] GitHub account (to host your code)
- [ ] Hosting platform accounts (Render/Vercel - both free)
- [ ] Environment variables ready
- [ ] Mistral AI API key (optional, for AI features)

---

## 🗄️ Step 1: Setup MongoDB Atlas (Database)

### 1.1 Create MongoDB Atlas Account
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" and sign up
3. Choose FREE tier (M0 Sandbox)
4. Select your preferred cloud provider (AWS recommended)
5. Choose region closest to your users
6. Click "Create Cluster" (takes 3-5 minutes)
```

### 1.2 Configure Database Access
```
1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: teamcollab_admin
5. Password: Generate secure password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"
```

### 1.3 Configure Network Access
```
1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, restrict to your server IP
4. Click "Confirm"
```

### 1.4 Get Connection String
```
1. Click "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string, looks like:
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
5. Replace <username> and <password> with your credentials
6. Add database name before the "?":
   mongodb+srv://teamcollab_admin:yourpassword@cluster0.xxxxx.mongodb.net/teamcollab?retryWrites=true&w=majority
```

---

## 🖥️ Step 2: Deploy Backend (Server)

### Option A: Render (Recommended - Free Tier)

#### 2.1 Push Code to GitHub
```bash
# In your project root
cd e:\team\ collab\ new\teamcollab
git init
git add .
git commit -m "Initial commit"

# Create new repo on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/teamcollab.git
git branch -M main
git push -u origin main
```

#### 2.2 Deploy to Render
```
1. Go to https://render.com and sign up (use GitHub)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: teamcollab-server
   - Region: Choose closest to you
   - Branch: main
   - Root Directory: teamcollab-server
   - Runtime: Node
   - Build Command: npm install
   - Start Command: node index.js
5. Click "Advanced" and add Environment Variables:
   - MONGO_URI: your MongoDB connection string
   - JWT_SECRET: generate random string (32+ characters)
   - MISTRAL_API_KEY: your Mistral AI key (optional)
   - PORT: 10000 (Render default)
   - NODE_ENV: production
6. Select Free tier
7. Click "Create Web Service"
8. Wait 3-5 minutes for deployment
9. Copy your service URL: https://teamcollab-server.onrender.com
```

#### 2.3 Generate Secure JWT Secret
```bash
# In PowerShell:
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Or use online generator:
https://generate-secret.vercel.app/32
```

### Option B: Railway.app (Alternative)

```
1. Go to https://railway.app and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Click on "teamcollab-server" service
5. Add Environment Variables (same as Render above)
6. Settings → Change start command to: node index.js
7. Settings → Change root directory to: teamcollab-server
8. Deploy automatically starts
9. Copy your public URL from Settings
```

### Option C: Heroku (Paid)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
cd teamcollab-server
heroku create teamcollab-server-prod

# Set environment variables
heroku config:set MONGO_URI="your_mongodb_connection_string"
heroku config:set JWT_SECRET="your_secret_key"
heroku config:set MISTRAL_API_KEY="your_mistral_key"

# Deploy
git subtree push --prefix teamcollab-server heroku main

# Open app
heroku open
```

---

## 🌐 Step 3: Deploy Frontend (Client)

### Option A: Vercel (Recommended - Free Tier)

#### 3.1 Prepare Frontend for Deployment

**Update API URL:**
```bash
# Edit teamcollab-client/src/services/api.js
```

Replace:
```javascript
const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});
```

With:
```javascript
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://teamcollab-server.onrender.com/api'
});
```

#### 3.2 Deploy to Vercel
```
1. Go to https://vercel.com and sign up (use GitHub)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Vite
   - Root Directory: teamcollab-client
   - Build Command: npm run build
   - Output Directory: dist
5. Add Environment Variable:
   - VITE_API_URL: https://teamcollab-server.onrender.com/api
     (use your actual Render server URL)
6. Click "Deploy"
7. Wait 2-3 minutes
8. Your app is live! Copy the URL: https://teamcollab.vercel.app
```

### Option B: Netlify (Alternative)

```
1. Go to https://netlify.com and sign up
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Configure:
   - Base directory: teamcollab-client
   - Build command: npm run build
   - Publish directory: teamcollab-client/dist
5. Add Environment Variables:
   - VITE_API_URL: your backend URL
6. Click "Deploy site"
7. Site will be live at: https://your-site-name.netlify.app
```

### Option C: Cloudflare Pages

```
1. Go to https://pages.cloudflare.com and sign up
2. Click "Create a project"
3. Connect your GitHub repository
4. Build settings:
   - Framework preset: Vite
   - Build command: cd teamcollab-client && npm install && npm run build
   - Build output directory: teamcollab-client/dist
5. Environment variables:
   - VITE_API_URL: your backend URL
6. Save and deploy
7. App live at: https://teamcollab.pages.dev
```

---

## 🔧 Step 4: Configure CORS on Backend

Update `teamcollab-server/index.js` to allow your frontend domain:

```javascript
// Replace the CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://teamcollab.vercel.app',  // Add your Vercel URL
    'https://your-custom-domain.com'   // Add custom domain if you have one
  ],
  credentials: true
}));
```

After updating, commit and push to GitHub - Render will auto-deploy.

---

## ✅ Step 5: Verify Deployment

### 5.1 Test Backend API
```bash
# Test in browser or Postman:
https://teamcollab-server.onrender.com/api/test

# Should return:
{"message": "TeamCollab API is running"}
```

### 5.2 Test Frontend
```
1. Visit your Vercel URL
2. Should see landing page with animations
3. Try signing up with a new account
4. Create a project and tasks
5. Check if AI suggestions work
6. Verify real-time updates
```

### 5.3 Common Issues & Fixes

**Issue: "Network Error" when logging in**
```
Fix: Check CORS configuration in backend
Verify VITE_API_URL in Vercel environment variables
```

**Issue: Backend shows "Application Error"**
```
Fix: Check Render logs for errors
Verify MONGO_URI is correct
Ensure JWT_SECRET is set
```

**Issue: "Cannot read properties of undefined"**
```
Fix: Clear browser cache and cookies
Check browser console for specific errors
Verify API endpoints return correct data
```

**Issue: MongoDB connection timeout**
```
Fix: Verify MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
Check connection string format
Ensure password doesn't have special characters (use URL encoding)
```

---

## 🔐 Step 6: Add Custom Domain (Optional)

### 6.1 For Frontend (Vercel)
```
1. Buy domain from Namecheap, GoDaddy, or Cloudflare
2. In Vercel, go to Project Settings → Domains
3. Add your domain: teamcollab.com
4. Follow DNS configuration instructions
5. Add CNAME record pointing to cname.vercel-dns.com
6. Wait 24-48 hours for DNS propagation
```

### 6.2 For Backend (Render)
```
1. In Render, go to your service → Settings
2. Add custom domain: api.teamcollab.com
3. Configure DNS with CNAME to your-service.onrender.com
4. SSL certificate auto-generated (free)
```

---

## 📊 Step 7: Monitor Your App

### 7.1 Render Dashboard
```
- View logs: Click "Logs" tab
- Check metrics: CPU, Memory usage
- Set up alerts for downtime
```

### 7.2 Vercel Analytics
```
1. Go to your project → Analytics
2. Enable Web Analytics (free)
3. View page views, performance metrics
4. Track user behavior
```

### 7.3 MongoDB Atlas Monitoring
```
1. Dashboard → Metrics
2. Monitor connections, operations/sec
3. Set up alerts for high usage
4. View slow queries
```

---

## 🔄 Step 8: Continuous Deployment (Auto-Deploy)

Both Render and Vercel support automatic deployments:

```
1. Make changes to your code locally
2. Commit: git add . && git commit -m "Update feature"
3. Push: git push origin main
4. Render and Vercel automatically detect changes
5. Build and deploy in 2-5 minutes
6. Check deployment status in dashboards
```

---

## 💰 Cost Breakdown (Free Tier)

| Service | Free Tier | Upgrade Cost |
|---------|-----------|--------------|
| MongoDB Atlas | 512 MB storage | $9/month for 2GB |
| Render | 750 hours/month | $7/month per service |
| Vercel | 100 GB bandwidth | $20/month for team |
| **Total** | **$0/month** | ~$36/month if upgraded |

**Free tier limitations:**
- Render: App sleeps after 15 min inactivity (takes 30s to wake)
- Vercel: 100 GB bandwidth limit
- MongoDB: 512 MB storage (~10k tasks)

---

## 🚀 Production Best Practices

### Security
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable HTTPS (auto on Vercel/Render)
- [ ] Sanitize user inputs
- [ ] Rate limit API endpoints
- [ ] Use helmet.js for security headers

### Performance
- [ ] Enable gzip compression
- [ ] Use CDN for static assets
- [ ] Add database indexes
- [ ] Implement caching (Redis)
- [ ] Optimize images

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Monitor uptime (UptimeRobot)
- [ ] Track analytics (Google Analytics)
- [ ] Log important events
- [ ] Set up alerts for failures

---

## 🆘 Troubleshooting

### Backend Issues

**Check Render Logs:**
```
1. Go to Render Dashboard
2. Click your service → Logs
3. Look for red error messages
4. Common errors:
   - MongoNetworkError: Check MongoDB connection string
   - Port already in use: Render uses PORT from env
   - Module not found: Run npm install in Build command
```

**Test API locally first:**
```bash
cd teamcollab-server
npm install
node index.js

# Should see: "Server running on port 5000"
# Test: http://localhost:5000/api/test
```

### Frontend Issues

**Check Vercel Build Logs:**
```
1. Vercel Dashboard → Deployments
2. Click latest deployment → View Build Logs
3. Look for errors in npm run build
4. Common issues:
   - Module not found: Check imports
   - Environment variable undefined: Add to Vercel
   - Build timeout: Optimize build process
```

**Test build locally:**
```bash
cd teamcollab-client
npm install
npm run build

# If successful, test production build:
npm run preview
# Open http://localhost:4173
```

### Database Issues

**MongoDB Connection Fails:**
```
1. Check IP whitelist in Atlas (should have 0.0.0.0/0)
2. Verify credentials in connection string
3. Test connection using MongoDB Compass
4. Check if cluster is active (not paused)
```

**Slow Queries:**
```
1. MongoDB Atlas → Performance Advisor
2. Add recommended indexes
3. Optimize query patterns
4. Consider upgrading tier if needed
```

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy
- **React Router**: https://reactrouter.com/en/main/guides/deploying

---

## 🎉 You're Live!

Once deployed, share your app:
```
🌐 Live URL: https://teamcollab-alpha.vercel.app
🔗 Backend API: https://teamcollab-1-gbpq.onrender.com
📊 API Test: https://teamcollab-1-gbpq.onrender.com/api/test
📱 Mobile-friendly: Yes (PWA-ready)
🔒 Secure: HTTPS enabled
⚡ Fast: Global CDN
💰 Cost: $0/month (free tier)
```

**Next Steps:**
1. Share with your team
2. Gather feedback
3. Monitor usage
4. Implement Phase 3 features
5. Consider custom domain
6. Set up analytics

---

## 🔗 Live Deployment URLs

### Production Environment
- **Frontend (Vercel)**: [https://teamcollab-alpha.vercel.app](https://teamcollab-alpha.vercel.app)
- **Backend (Render)**: [https://teamcollab-1-gbpq.onrender.com](https://teamcollab-1-gbpq.onrender.com)
- **API Health Check**: [https://teamcollab-1-gbpq.onrender.com/api/test](https://teamcollab-1-gbpq.onrender.com/api/test)
- **Database**: MongoDB Atlas (managed cloud)

### Quick Links
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com
- **MongoDB Atlas**: https://cloud.mongodb.com
- **GitHub Repository**: https://github.com/yasir2340na/teamcollab

---

## 🔄 Update Workflow

```bash
# 1. Make changes locally
cd e:\team\ collab\ new\teamcollab

# 2. Test changes
cd teamcollab-client
npm run dev

# 3. Commit and push
git add .
git commit -m "Add new feature"
git push origin main

# 4. Automatic deployment
# ✅ Render deploys backend (3-5 min)
# ✅ Vercel deploys frontend (2-3 min)

# 5. Verify live site
# Visit your Vercel URL and test
```

---

## 🌟 Advanced: Docker Deployment (Optional)

For self-hosting on VPS (DigitalOcean, AWS EC2):

**Create Dockerfiles:**

`teamcollab-server/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]
```

`teamcollab-client/Dockerfile`:
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Deploy with Docker Compose:**
```yaml
version: '3.8'
services:
  backend:
    build: ./teamcollab-server
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
  
  frontend:
    build: ./teamcollab-client
    ports:
      - "80:80"
    depends_on:
      - backend
```

---

## ✅ Deployment Complete!

Your TeamCollab app is now live and accessible worldwide! 🚀

**Quick Access:**
- **Frontend**: [https://teamcollab-alpha.vercel.app](https://teamcollab-alpha.vercel.app)
- **Backend API**: [https://teamcollab-1-gbpq.onrender.com](https://teamcollab-1-gbpq.onrender.com)
- **API Test Endpoint**: [https://teamcollab-1-gbpq.onrender.com/api/test](https://teamcollab-1-gbpq.onrender.com/api/test)
- **Database**: MongoDB Atlas (managed)

### 📱 Share Your App:
```
✅ Live Demo: https://teamcollab-alpha.vercel.app
✅ Sign up and start collaborating!
✅ Features: AI Tasks, Real-time Updates, Kanban Board
✅ Free to use - No credit card required
```

Need help? Check logs in Render/Vercel dashboards or review troubleshooting section above.
