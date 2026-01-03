🌲 US Parks Explorer
An interactive front-end web application built with modern JavaScript that allows users to explore United States Parks on a map using real data from the National Park Service API.
Show Image
🎯 Project Goal
The goal of this project was to:

Work with a public REST API
Handle asynchronous data loading
Build a clean, user-friendly interface
Practice real front-end workflows using modern tooling
Secure API key management with environment variables

✨ Key Features

🗺️ Interactive map with park markers (Leaflet.js)
🌐 Satellite imagery background for immersive experience
📊 Real-time data from the National Park Service API
🔍 Search parks by name
🏷️ Filter parks by State
🌙 Light / Dark mode toggle
📱 Responsive layout for all devices
⚡ Fast development environment using Vite
🎨 Color-coded markers by state
📍 Clustered markers for better performance

🛠️ Technologies Used

HTML5 - Structure
CSS3 - Styling & animations
JavaScript (ES6+) - Application logic
Leaflet.js - Interactive maps
Vite - Build tool & dev server
National Park Service API - Park data

📋 Prerequisites
Before you begin, ensure you have installed:

Node.js (v14 or higher)
npm (comes with Node.js)
A free API key from the National Park Service

🔑 Getting an API Key

Visit the NPS Developer Portal
Click "Get Started"
Fill out the form with your email
Check your email for the API key


⚙️ Setup & Installation
1. Clone the repository
bashgit clone https://github.com/darkobenic92/us-parks-explorer.git
cd us-parks-explorer
2. Install dependencies
bashnpm install
3. Create environment file
Create a .env file in the project root:
bashVITE_NPS_API_KEY=your_api_key_here
⚠️ IMPORTANT: Replace your_api_key_here with your actual API key from step above.
The .env file is in .gitignore to keep your API key secure.
4. Start the development server
bashnpm run dev
The app will automatically open in your browser at http://localhost:5173/
🚀 Available Scripts
bashnpm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build

📂 Project Structure
us-parks-explorer/

├── index.html          # Main HTML file

├── main.js             # Application logic

├── style.css           # Styles

├── vite.config.js      # Vite configuration

├── package.json        # Dependencies

├── .env                # API key (DO NOT COMMIT)

├── .env.example        # Example env file

├── .gitignore          # Git ignore rules

└── README.md           # This file

🌐 Data Source
This project uses the official National Park Service API:

API Documentation
Get API Key

🧩 What I Learned
Through this project, I practiced:

✅ Fetching and handling API data with fetch and async/await
✅ Managing application state (filters, search, UI updates)
✅ Securing API keys with environment variables
✅ DOM manipulation and event handling
✅ Integrating third-party libraries (Leaflet, Marker Clustering)
✅ Debugging real issues related to CORS, paths, and tooling
✅ Structuring a front-end project in a maintainable way
✅ Using Vite for modern development workflow

🎨 Features in Detail
Interactive Map

Satellite imagery background
Clustered markers for performance
Color-coded by state
Click markers to see park details
Smooth zoom and pan

Search & Filter

Real-time search by park name
Filter by state dropdown
Combination of both filters
Live statistics updates

Dark Mode

Toggle between light and dark themes
Preference saved in localStorage
Smooth transitions

Responsive Design

Works on desktop, tablet, and mobile
Adaptive layout
Touch-friendly controls


📝 Notes for Developers
This project demonstrates:

Modern JavaScript practices (ES6+, async/await, modules)
API integration with error handling
State management without frameworks
Third-party library integration
Environment variable security
Build tooling with Vite

👤 Author
Darko


📄 License
This project is open source and available under the MIT License.
🙏 Acknowledgments

National Park Service for the amazing API
Leaflet.js for the mapping library
Esri for satellite imagery tiles
Vite team for the awesome build tool


