#!/bin/bash
# AI Code Detector - Quick Start Script
# Usage: bash start.sh

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║       AI Code Detector - Quick Start     ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Install from https://nodejs.org (v18+)"
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
  echo "❌ Node.js v18+ required. Current: $(node -v)"
  exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Setup server
echo ""
echo "📦 Installing server dependencies..."
cd server
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "📄 Created server/.env — please add your GEMINI_API_KEY and MONGODB_URI"
fi
npm install --silent
echo "✅ Server ready"

# Setup client
echo ""
echo "📦 Installing client dependencies..."
cd ../client
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "📄 Created client/.env"
fi
npm install --silent
echo "✅ Client ready"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║         Setup Complete! 🚀               ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "  1. Edit server/.env — add your GEMINI_API_KEY (get free at aistudio.google.com)"
echo "  2. Edit server/.env — add your MONGODB_URI (or use localhost MongoDB)"
echo ""
echo "To start:"
echo "  Terminal 1: cd server && npm run dev"
echo "  Terminal 2: cd client && npm start"
echo ""
echo "To seed demo accounts:"
echo "  cd server && npm run seed"
echo ""
echo "Then open: http://localhost:3000"
echo ""
