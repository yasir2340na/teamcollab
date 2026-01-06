# Deployment Guide

This guide covers deploying TeamCollab to various platforms.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Full Stack Deployment](#full-stack-deployment)
- [Post-Deployment](#post-deployment)

---

## Prerequisites

- Node.js 18+ installed on server
- MongoDB database (local or cloud)
- Domain name (optional but recommended)
- SSL certificate (for HTTPS)
- Git

---

## Environment Setup

### Production Environment Variables

#### Server (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/teamcollab
JWT_SECRET=<generate-secure-random-string>
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

Generate secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Client (.env.production)
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_WS_URL=https://api.yourdomain.com
```

---

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create Account**: Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **Create Cluster**:
   - Choose your cloud provider (AWS, Google Cloud, Azure)
   - Select region closest to your users
   - Choose cluster tier (M0 Free for testing)

3. **Configure Access**:
   - Database Access: Create database user
   - Network Access: Add IP whitelist (0.0.0.0/0 for testing, specific IPs for production)

4. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` and `<dbname>`

5. **Update .env**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/teamcollab?retryWrites=true&w=majority
   ```

---

## Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI**:
```bash
npm install -g heroku
heroku login
```

2. **Create Heroku App**:
```bash
cd teamcollab-server
heroku create teamcollab-api
```

3. **Set Environment Variables**:
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
```

4. **Deploy**:
```bash
git init  # if not already a git repo
git add .
git commit -m "Initial commit"
git push heroku main
```

5. **Open App**:
```bash
heroku open
```

### Option 2: DigitalOcean / AWS / VPS

1. **Setup Server**:
```bash
# Connect to your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2
npm install -g pm2

# Install MongoDB (if not using Atlas)
# Follow: https://docs.mongodb.com/manual/administration/install-on-linux/
```

2. **Deploy Application**:
```bash
# Clone repository
cd /var/www
git clone https://github.com/yourusername/teamcollab.git
cd teamcollab/teamcollab-server

# Install dependencies
npm install --production

# Create .env file
nano .env
# (paste production environment variables)

# Start with PM2
pm2 start index.js --name teamcollab-api
pm2 save
pm2 startup
```

3. **Setup Nginx Reverse Proxy**:
```bash
# Install Nginx
apt install -y nginx

# Create Nginx configuration
nano /etc/nginx/sites-available/teamcollab
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/teamcollab /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

4. **Setup SSL with Let's Encrypt**:
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d api.yourdomain.com

# Auto-renewal is setup by default
```

### Option 3: Railway

1. **Create Account**: Visit [Railway.app](https://railway.app)

2. **New Project**: 
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure**:
   - Set root directory to `teamcollab-server`
   - Add environment variables in Railway dashboard
   - Railway will auto-detect Node.js and deploy

4. **Custom Domain** (optional):
   - Settings → Domains → Add custom domain
   - Point your domain to Railway

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
cd teamcollab-client
vercel
```

3. **Configure**:
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Add environment variables in Vercel dashboard

4. **Custom Domain**:
   - Vercel dashboard → Domains → Add
   - Follow DNS configuration steps

### Option 2: Netlify

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Build**:
```bash
cd teamcollab-client
npm run build
```

3. **Deploy**:
```bash
netlify deploy --prod
```

4. **Configure**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variables: Add in Netlify dashboard

### Option 3: Static Server (VPS)

1. **Build Application**:
```bash
cd teamcollab-client
npm run build
```

2. **Upload to Server**:
```bash
scp -r dist/* user@server:/var/www/teamcollab
```

3. **Nginx Configuration**:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/teamcollab;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

4. **Setup SSL**:
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Full Stack Deployment

### Option 1: Single VPS (Both Frontend & Backend)

Follow the VPS deployment steps for both frontend and backend on the same server.

**Nginx configuration for both**:
```nginx
# Backend
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        # ... proxy headers
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/teamcollab;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Option 2: Docker Deployment

1. **Create Dockerfile for Backend** (`teamcollab-server/Dockerfile`):
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]
```

2. **Create Dockerfile for Frontend** (`teamcollab-client/Dockerfile`):
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

3. **Create docker-compose.yml** (root directory):
```yaml
version: '3.8'
services:
  backend:
    build: ./teamcollab-server
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
    restart: unless-stopped

  frontend:
    build: ./teamcollab-client
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

  mongodb:
    image: mongo:latest
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

volumes:
  mongodb_data:
```

4. **Deploy**:
```bash
docker-compose up -d
```

---

## Post-Deployment

### 1. Verify Deployment

Test all functionality:
- [ ] User signup/login
- [ ] Create project
- [ ] Add/edit/delete tasks
- [ ] Drag and drop works
- [ ] Real-time updates work
- [ ] AI suggestions (if configured)

### 2. Monitor Application

**Setup PM2 monitoring**:
```bash
pm2 monit
pm2 logs teamcollab-api
```

**Check logs**:
```bash
# PM2
pm2 logs

# Heroku
heroku logs --tail

# Railway
railway logs

# Docker
docker-compose logs -f
```

### 3. Setup Backups

**MongoDB Backup Script**:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out=/backups/teamcollab_$DATE
```

**Automate with cron**:
```bash
crontab -e
# Add: 0 2 * * * /path/to/backup-script.sh
```

### 4. Security Checklist

- [ ] HTTPS enabled (SSL certificate)
- [ ] Environment variables secured
- [ ] MongoDB authentication enabled
- [ ] CORS configured for specific domains
- [ ] Rate limiting implemented
- [ ] Security headers configured
- [ ] Regular dependency updates
- [ ] Firewall configured
- [ ] Regular backups scheduled
- [ ] Monitoring and alerts setup

### 5. Performance Optimization

**Enable caching**:
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

**Enable compression**:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1000;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

**CDN Setup** (optional):
- Cloudflare
- AWS CloudFront
- Vercel Edge Network

---

## Troubleshooting

### Common Issues

**"Cannot connect to MongoDB"**
- Check MongoDB URI
- Verify IP whitelist (Atlas)
- Check network connectivity

**"API calls fail from frontend"**
- Verify CORS settings
- Check API base URL in frontend
- Ensure backend is running

**"Socket.IO connection fails"**
- Check WebSocket URL
- Verify server supports WebSockets
- Check Nginx WebSocket configuration

**"Application crashes on startup"**
- Check environment variables
- Review logs for errors
- Verify all dependencies installed

---

## Support

Need help with deployment?
- 📖 Check our [documentation](../README.md)
- 🐛 [Open an issue](https://github.com/yourusername/teamcollab/issues)
- 💬 [Discussions](https://github.com/yourusername/teamcollab/discussions)

---

**Happy Deploying! 🚀**
