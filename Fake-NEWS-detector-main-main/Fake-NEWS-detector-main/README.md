# Fake News Detection App

## Overview

This is a web application for detecting and fact-checking fake news claims using the Google Fact Check API. It allows users to check individual claims or URLs, view fact-check results from multiple sources, and use a Chrome extension to fact-check text directly from any web page.

## Features

### Core Features
- Fact-check any claim or URL using ML models
- Batch checker for multiple URLs
- Fact-check history and statistics
- Chrome extension for right-click fact-checking
- Modern, responsive UI

### Advanced Features
- **Explainable AI**: Visual explanations of ML model decisions
- **Collaborative Fact-Checking**:
  - Nested evidence threads
  - Community voting with reasons
  - Fact-check battles
- **Visualization Tools**:
  - Consensus timelines
  - Bias detection
  - Claim provenance graphs
- **AI-Powered Tools**:
  - Automated evidence suggestion
  - Multi-modal evidence analysis
  - Real-time fact-checking

## Project Structure

```
fake-news-detector/
├── src/
│   ├── components/          # React components
│   │   └── features/       # Advanced feature components
│   │       ├── explanation/
│   │       ├── threads/
│   │       ├── visualization/
│   │       └── toxicity/
│   ├── services/            # API services
│   │   └── features/       # Advanced feature services
│   ├── utils/              # Utility functions
│   │   └── features/       # Advanced feature utilities
│   └── App.js              # Main application
├── ml-backend/             # Backend ML services
│   ├── models/             # ML models
│   ├── services/           # Backend services
│   └── app.py             # Flask backend
├── public/                 # Static files
└── package.json           # Project configuration
```

## Getting Started

### Prerequisites
- Node.js and npm installed
- Python 3.x for backend ML models
- A Google Fact Check API key (optional)

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/fake-news-detector.git
cd fake-news-detector

# Install frontend dependencies
npm install

# Install backend dependencies
cd ml-backend
pip install -r requirements.txt

# Start the development servers
# In one terminal:
npm run dev

# In another terminal:
python app.py
```

## Getting Started

### Prerequisites
- Node.js and npm installed
- A Google Fact Check API key ([get one here](https://developers.google.com/fact-check/tools/api))

### Installation
```sh
# Clone the repository
https://github.com/yourusername/fake-news-detector.git
cd fake-news-detector

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open your browser to [http://localhost:8080](http://localhost:8080) to use the app.

## Chrome Extension
A minimal Chrome extension is included in the `chrome-extension/` directory. It allows you to right-click selected text on any page and send it to the Fake News Detector web app for fact-checking.

### How to Load in Chrome (Development)
1. Open Chrome and go to `chrome://extensions/`.
2. Enable "Developer mode" (top right).
3. Click "Load unpacked" and select the `chrome-extension/` directory.
4. The extension will now be available in your browser.

### Features
- Adds a context menu item to fact-check selected text using the Fake News Detector web app.

## License
MIT
