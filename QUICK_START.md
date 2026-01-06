# 🚀 TeamCollab - Quick Start Guide

## ⚡ Get Running in 5 Minutes!

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free)
- Mistral AI API key (free)

---

## 📋 Step-by-Step Setup

### 1️⃣ **Clone & Install**
```bash
# Navigate to project
cd "e:\team collab new\teamcollab"

# Install client dependencies
cd teamcollab-client
npm install

# Install server dependencies
cd ../teamcollab-server
npm install
```

---

### 2️⃣ **Configure Environment**

Your `.env` file in `teamcollab-server/` should already have:
```env
MONGODB_URI=mongodb+srv://ahad:Ahad1212@teamcollab.wpao9dc.mongodb.net/teamcollab
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random
MISTRAL_API_KEY=your_mistral_api_key_here
PORT=5000
```

✅ **MongoDB**: Already configured and working
✅ **Mistral AI**: Using `open-mistral-7b` free tier model

---

### 3️⃣ **Start Development Servers**

**Terminal 1 - Backend:**
```bash
cd teamcollab-server
npm start
```
You should see:
```
✅ MongoDB connected
✅ Server running on port 5000
✅ Socket.IO ready
```

**Terminal 2 - Frontend:**
```bash
cd teamcollab-client
npm run dev
```
You should see:
```
✅ Vite dev server running
✅ Local: http://localhost:5173/
```

---

### 4️⃣ **Open & Test**

1. Open browser: `http://localhost:5173`
2. Click **"Sign Up"** to create account
3. Create a new project
4. Try AI task suggestions
5. Add tasks with drag & drop
6. Test new features:
   - 💬 Click "Comments" on a task
   - 🔔 Check notification bell in navbar
   - 🏷️ Add priority and tags to tasks
   - 🔍 Use search and filters
   - 📊 Click "Activity" to see timeline

---

## 🎯 Feature Testing Checklist

### Core Features:
- [ ] User registration works
- [ ] Login persists after refresh
- [ ] Create new project
- [ ] AI suggestions generate tasks
- [ ] Drag & drop tasks between columns
- [ ] Edit and delete tasks

### New Features v2.0:
- [ ] Add comment to task (opens modal)
- [ ] Post comment and see it appear
- [ ] Delete your own comment
- [ ] View activity feed (click "Activity")
- [ ] Check notifications (bell icon)
- [ ] Mark notifications as read
- [ ] Set task priority (High/Medium/Low)
- [ ] Add tags to tasks (comma-separated)
- [ ] Search tasks by name
- [ ] Filter tasks by priority
- [ ] See priority statistics

### Real-time Testing:
- [ ] Open app in two browser windows
- [ ] Create task in one window
- [ ] See it appear in other window (real-time!)
- [ ] Drag task in one window
- [ ] See it move in other window

---

## 🎨 What You'll See

### Dashboard Page:
- Project cards with glassmorphic design
- AI suggestion button for each project
- Create new project form
- Beautiful gradient backgrounds
- Smooth animations

### Tasks Page (Kanban Board):
- Three columns: To Do, In Progress, Done
- Drag & drop task cards
- **NEW**: Priority badges (red/yellow/green)
- **NEW**: Tag chips on cards
- **NEW**: Comments button on each card
- **NEW**: Activity feed toggle
- **NEW**: Search bar
- **NEW**: Priority filter buttons
- **NEW**: Enhanced statistics

### Comments Modal (NEW):
- Glassmorphic modal overlay
- List of all task comments
- User avatars with gradients
- Timestamps for each comment
- Input field to add comments
- Delete button for your comments

### Notification Bell (NEW):
- Bell icon in navbar
- Red badge with unread count
- Dropdown menu on click
- List of notifications
- Mark as read buttons
- Smooth animations

### Activity Feed (NEW):
- Collapsible timeline
- Color-coded activities
- User attribution
- Chronological order
- Auto-scroll to latest

---

## 🔧 Troubleshooting

### Backend won't start:
```bash
# Check if MongoDB URI is correct
# Verify .env file exists in teamcollab-server/
# Make sure no other app is using port 5000

# Test MongoDB connection:
node -e "require('mongoose').connect('YOUR_MONGODB_URI').then(() => console.log('Connected!')).catch(err => console.error(err))"
```

### Frontend won't start:
```bash
# Clear node_modules and reinstall
cd teamcollab-client
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Socket.IO not working:
```bash
# Make sure backend is running on port 5000
# Check browser console for connection errors
# Verify Socket.IO is listening in server logs
```

### AI suggestions not working:
```bash
# Verify Mistral API key is in .env
# Check server console for API errors
# Make sure you're using open-mistral-7b model
```

### Comments/Activity not loading:
```bash
# Check Network tab in browser DevTools
# Verify API routes are registered in index.js
# Check MongoDB for data
# Look for errors in server console
```

---

## 📱 Features Quick Reference

### Priority Levels:
- 🔴 **High**: Urgent, needs immediate attention
- 🟡 **Medium**: Important, regular priority
- 🟢 **Low**: Can wait, nice to have

### Tag Examples:
- `frontend, backend, api` - Technology
- `urgent, review, testing` - Status
- `bug, feature, enhancement` - Type
- `v1.0, v2.0, backlog` - Version

### Search Tips:
- Search works on task titles and descriptions
- Case-insensitive matching
- Instant results as you type
- Combine with filters for precision

### Filter Usage:
- Click "All" to see everything
- Click "High" to show only high-priority tasks
- Click "Medium" to show only medium-priority tasks
- Click "Low" to show only low-priority tasks

---

## 🎓 Best Practices

### Project Organization:
1. Create separate projects for different initiatives
2. Use descriptive project names
3. Add detailed descriptions for AI suggestions
4. Archive completed projects

### Task Management:
1. Set appropriate priorities
2. Use tags for categorization
3. Add due dates to all tasks
4. Assign tasks to team members
5. Keep descriptions clear and actionable

### Collaboration:
1. Use comments for discussions
2. Check activity feed regularly
3. Respond to notifications
4. Keep team updated on progress
5. Use @mentions in comments (future feature)

### Performance Tips:
1. Don't create too many projects (keep under 50)
2. Archive old tasks instead of deleting
3. Use filters to reduce visible tasks
4. Keep comments concise
5. Use tags instead of long descriptions

---

## 📞 Need Help?

### Check Documentation:
- [COMPETITIVE_UPGRADE_GUIDE.md](./COMPETITIVE_UPGRADE_GUIDE.md) - Full feature documentation
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical details
- [LAUNCH_READY.md](./LAUNCH_READY.md) - Complete overview
- [README.md](./README.md) - Main documentation

### Common Issues:
- **Can't login**: Check if backend is running
- **Tasks won't save**: Verify MongoDB connection
- **AI not working**: Check Mistral API key
- **No real-time updates**: Restart both servers

---

## 🎉 You're Ready!

Your TeamCollab app is now running with all the latest features:
- ✅ AI-powered task suggestions
- ✅ Real-time collaboration
- ✅ Comments and discussions
- ✅ Activity tracking
- ✅ Notifications system
- ✅ Priority management
- ✅ Tag organization
- ✅ Search and filters
- ✅ Beautiful modern UI

**Start creating projects and managing tasks like a pro!** 🚀

---

<div align="center">

**Happy Project Management!** 

Made with ❤️ using React, Node.js, MongoDB, and Mistral AI

</div>
