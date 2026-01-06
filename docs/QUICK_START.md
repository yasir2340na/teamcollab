# TeamCollab - Quick Start Guide

Welcome to TeamCollab! This guide will help you get started quickly.

## 🚀 Quick Setup (5 minutes)

### 1. Prerequisites Check
Make sure you have:
- ✅ Node.js 18 or higher installed
- ✅ MongoDB running (local or Atlas)
- ✅ Git installed

### 2. Clone & Install
```bash
# Clone the repository
git clone https://github.com/yourusername/teamcollab.git
cd teamcollab

# Install server dependencies
cd teamcollab-server
npm install

# Install client dependencies
cd ../teamcollab-client
npm install
```

### 3. Configure Environment

**Server Setup** (`teamcollab-server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/teamcollab
JWT_SECRET=your_secret_key_change_this
NODE_ENV=development
```

**Client Setup** (`teamcollab-client/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Start Development

Open two terminals:

**Terminal 1 - Backend:**
```bash
cd teamcollab-server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd teamcollab-client
npm run dev
```

### 5. Access the App
Open your browser and go to: `http://localhost:5173`

## 📱 First Steps

1. **Sign Up**: Create your account
2. **Create Project**: Click "New Project" on dashboard
3. **Add Tasks**: Navigate to your project and add tasks
4. **Drag & Drop**: Move tasks between columns
5. **AI Suggestions**: Try the "AI Suggest Tasks" feature

## 🎯 Key Features to Try

- ✨ **Drag & Drop**: Move tasks between columns
- 🤖 **AI Suggestions**: Get smart task recommendations
- 🔄 **Real-time Updates**: Open the app in two browsers
- 📊 **Statistics**: View your project progress
- 🎨 **Beautiful UI**: Enjoy the modern design

## 🛠️ Common Commands

### Server
```bash
npm run dev      # Start development server with hot reload
npm start        # Start production server
npm test         # Run tests (when configured)
```

### Client
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 💡 Tips

- Use MongoDB Compass to view your database
- Check browser console for errors
- Enable React DevTools for debugging
- MongoDB must be running before starting the server

## 🐛 Troubleshooting

**Server won't start?**
- Check if MongoDB is running: `mongod`
- Check if port 5000 is available
- Verify `.env` file exists with correct values

**Client won't start?**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check if port 5173 is available
- Try `npm run dev -- --host` to expose to network

**Can't connect to API?**
- Ensure server is running on port 5000
- Check CORS settings in server
- Verify API URL in client `.env`

**MongoDB connection error?**
- Start MongoDB: `mongod` or `brew services start mongodb-community`
- Check MongoDB URI in `.env`
- For Atlas, ensure IP is whitelisted

## 📚 Next Steps

- Read the full [README.md](../README.md)
- Check [CONTRIBUTING.md](../CONTRIBUTING.md) to contribute
- Review [API Documentation](../README.md#api-documentation)
- Join our community (Discord link)

## 🆘 Need Help?

- 📖 Check the [full documentation](../README.md)
- 🐛 [Report bugs](https://github.com/yourusername/teamcollab/issues)
- 💬 Ask in [Discussions](https://github.com/yourusername/teamcollab/discussions)
- 📧 Email: support@teamcollab.example.com

---

**Happy Collaborating! 🎉**

[← Back to README](../README.md)
