# 🔧 401 Unauthorized Error - Troubleshooting Guide

## ❌ Problem
Getting 401 Unauthorized errors when trying to:
- Create projects
- Fetch notifications
- Access protected routes

## ✅ Root Causes & Solutions

### 1. **JWT_SECRET Not Set on Render** ⚠️
**Most Common Issue!**

#### Check if JWT_SECRET exists:
```
1. Go to Render Dashboard: https://dashboard.render.com
2. Click your service (teamcollab-1-gbpq)
3. Environment tab
4. Look for JWT_SECRET variable
```

#### If Missing - Add JWT_SECRET:
```
1. Click "Add Environment Variable"
2. Key: JWT_SECRET
3. Value: Generate a secure random string (32+ characters)

Generate in PowerShell:
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

Or use: https://generate-secret.vercel.app/32

Example: aB3dE7fG9hJ2kL4mN6pQ8rS0tU1vW5xY
```

#### After Adding JWT_SECRET:
```
1. Render will automatically redeploy
2. Wait 3-5 minutes
3. Test again
```

---

### 2. **Token Not Persisting After Login** 🔐

**Symptoms:**
- Login seems successful but dashboard shows 401 errors
- Creating projects fails immediately after login

**Solution Applied:**
- Updated Login.jsx to use `window.location.href = '/dashboard'` instead of `nav('/')`
- This forces a full page reload to ensure token is loaded
- Changes are already pushed and deploying

**Wait 2-3 minutes for Vercel to redeploy, then test:**
```
1. Go to: https://teamcollab-alpha.vercel.app
2. Click "Login"
3. Enter credentials
4. Should redirect to dashboard and work correctly
```

---

### 3. **CORS/Environment Variable Issues** 🌐

**Check Vercel Environment Variables:**
```
1. Go to: https://vercel.com/dashboard
2. Your project → Settings → Environment Variables
3. Ensure VITE_API_URL is set to:
   https://teamcollab-1-gbpq.onrender.com/api
4. Must be set for: Production, Preview, Development
```

**If missing or incorrect:**
```
1. Add/Update the variable
2. Go to Deployments tab
3. Latest deployment → ⋯ menu → Redeploy
```

---

### 4. **Token Expiration** ⏰

**Current Token Lifespan:** 1 hour

**If you logged in more than 1 hour ago:**
- Logout and login again
- Token will be refreshed

**To extend token lifetime** (backend change):
Edit `teamcollab-server/routes/auth.js`:
```javascript
// Change from:
const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

// To (24 hours):
const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });

// Or (7 days):
const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
```

---

## 🧪 Testing Steps

### Step 1: Verify Backend is Running
```bash
# Open in browser:
https://teamcollab-1-gbpq.onrender.com/api/test

# Should return:
{"message": "TeamCollab API is running"}
```

### Step 2: Check Render Logs
```
1. Go to: https://dashboard.render.com
2. Click your service
3. Logs tab
4. Look for:
   - "✅ MongoDB connected"
   - "🚀 Server running on port 10000"
   - Any JWT errors
```

### Step 3: Test Login Flow
```
1. Open: https://teamcollab-alpha.vercel.app
2. Open Browser Console (F12)
3. Click "Login"
4. Enter credentials
5. Watch console for errors
6. After redirect, check:
   - localStorage.getItem('token') should return a long string
   - Network tab → requests should have "Authorization: Bearer ..." header
```

### Step 4: Verify Token in Browser
```javascript
// Open browser console on your site:
localStorage.getItem('token')

// Should return something like:
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// If null or undefined, login didn't save token correctly
```

---

## 🔍 Debugging Commands

### Check Token in Console:
```javascript
// Paste in browser console:
console.log('Token:', localStorage.getItem('token'));
console.log('Is logged in:', !!localStorage.getItem('token'));
```

### Test API Request Manually:
```javascript
// Paste in browser console:
fetch('https://teamcollab-1-gbpq.onrender.com/api/projects', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(r => r.json())
.then(data => console.log('Projects:', data))
.catch(err => console.error('Error:', err));
```

### Clear Auth State:
```javascript
// Paste in browser console if you want to reset:
localStorage.removeItem('token');
window.location.href = '/login';
```

---

## 📋 Checklist

Before asking for help, verify:

- [ ] Render backend is running (check /api/test endpoint)
- [ ] JWT_SECRET is set in Render environment variables
- [ ] VITE_API_URL is set in Vercel environment variables
- [ ] Both Vercel and Render have finished deploying latest code
- [ ] Browser console shows no CORS errors
- [ ] localStorage has a token after login
- [ ] Token is being sent in Authorization header (check Network tab)
- [ ] Cleared browser cache (Ctrl+Shift+R)

---

## 🆘 Still Not Working?

### Quick Fixes to Try:

1. **Hard Refresh:**
   ```
   Windows: Ctrl + Shift + R
   Mac: Cmd + Shift + R
   ```

2. **Clear All Data:**
   ```javascript
   // Browser console:
   localStorage.clear();
   window.location.href = '/signup';
   ```

3. **Try Incognito/Private Window:**
   - Rules out browser cache/extension issues

4. **Check Render Service Status:**
   - Ensure it's not sleeping (free tier sleeps after 15 min)
   - First request may take 30 seconds to wake up

5. **Verify Environment Variables Match:**
   ```
   Render: JWT_SECRET must be 32+ characters
   Vercel: VITE_API_URL must end with /api
   ```

---

## 🎯 Expected Behavior After Fix

### Signup Flow:
```
1. Click "Sign Up"
2. Fill in name, email, password
3. Submit form
4. ✅ Account created
5. ✅ Automatically logged in
6. ✅ Redirected to /dashboard
7. ✅ Dashboard loads projects
```

### Login Flow:
```
1. Click "Login"
2. Enter email, password
3. Submit form
4. ✅ Token saved to localStorage
5. ✅ Page reloads and redirects to /dashboard
6. ✅ Dashboard loads successfully
7. ✅ Can create projects
```

### Creating Project:
```
1. On dashboard, click "+ New Project"
2. Enter project name and description
3. Submit
4. ✅ Project appears immediately
5. ✅ No 401 errors in console
```

---

## 💡 Prevention Tips

1. **Always set strong JWT_SECRET in production**
   - Never use default values
   - Use 32+ random characters

2. **Monitor token expiration**
   - Consider longer expiration (24h or 7d)
   - Or implement refresh tokens

3. **Check logs regularly**
   - Render logs show auth failures
   - Set up error alerts

4. **Test after every deployment**
   - Signup new user
   - Login existing user
   - Create a project

---

## 🔗 Quick Links

- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Live App**: https://teamcollab-alpha.vercel.app
- **API Test**: https://teamcollab-1-gbpq.onrender.com/api/test

---

## ⏰ Timeline

**Changes Pushed:** Just now  
**Vercel Redeploy:** 2-3 minutes  
**Render Redeploy:** 3-5 minutes  
**Test After:** ~5 minutes from now  

**Expected Result:** Login should work perfectly and projects can be created without 401 errors! ✅
