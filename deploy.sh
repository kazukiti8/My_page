#!/bin/bash

# Production Deployment Script for My Serene Start Page

echo "🚀 Starting production deployment..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# 2. Build process (if needed)
echo "🔨 Building for production..."
npm run build

# 3. Create production directory
echo "📁 Creating production directory..."
mkdir -p production

# 4. Copy files to production directory
echo "📋 Copying files to production..."
cp -r css production/
cp -r js production/
cp -r images production/ 2>/dev/null || echo "No images directory found"
cp index.prod.html production/index.html
cp sw.js production/
cp server.js production/
cp package.json production/
cp .env production/ 2>/dev/null || echo "No .env file found"
cp env.example production/

# 5. Create production README
cat > production/README.md << EOF
# My Serene Start Page - Production

## Quick Start

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Set up environment variables:
   \`\`\`bash
   cp env.example .env
   # Edit .env with your API keys
   \`\`\`

3. Start the server:
   \`\`\`bash
   npm start
   \`\`\`

4. Open http://localhost:3000 in your browser

## Features

- 🌤️ Real-time weather information
- 📚 Organized bookmarks with categories
- ✅ To-do list management
- 📝 Quick notes
- 📰 News feed integration
- 📅 Google Calendar integration
- 🗺️ Google Maps integration
- 💻 System information monitoring
- 🎨 Customizable themes
- 📱 PWA support

## Environment Variables

- \`OPENWEATHER_API_KEY\`: OpenWeatherMap API key
- \`PORT\`: Server port (default: 3000)

## Deployment

This application can be deployed to:
- Heroku
- Vercel
- Netlify
- AWS
- Google Cloud Platform
- Any Node.js hosting service

## License

MIT License
EOF

echo "✅ Production build completed!"
echo "📂 Production files are in the 'production' directory"
echo ""
echo "🚀 To deploy:"
echo "1. cd production"
echo "2. npm install"
echo "3. npm start"
echo ""
echo "🌐 Or deploy to a hosting service:"
echo "- Heroku: git push heroku main"
echo "- Vercel: vercel --prod"
echo "- Netlify: netlify deploy --prod" 