# Spatial-Temporal Dashboard

A modern React/Next.js dashboard application for visualizing dynamic data over maps and timelines, featuring polygon creation and color-coded data display based on selected datasets.

## 🚀 Features

### Core Functionality
- **Interactive Timeline Slider**: Hourly resolution with 30-day window (15 days before/after today)
  - Single point time selection
  - Dual-ended range selection
  - Visual time markers and labels

- **Interactive Map with Leaflet**:
  - Pan and zoom functionality  
  - Polygon drawing tools (3-12 points)
  - Click near start point or max points to complete
  - Polygon persistence and management

- **Data Source Integration**:
  - Open-Meteo API for weather data
  - Temperature data fetching and visualization
  - Real-time data updates based on timeline

- **Color-Coded Visualizations**:
  - User-defined color rules (threshold-based)
  - Automatic polygon coloring based on data values
  - Dynamic updates when timeline changes

- **Responsive Design**: Works on desktop, tablet, and mobile devices

### UI Components
- Modern dark theme with purple accents
- Sidebar for polygon and data source management
- Real-time polygon drawing feedback
- Data source configuration with color rules

## 🛠 Technology Stack

### Required Stack
- **React 18.2.0**
- **Next.js 14.0.0**
- **TypeScript 5.2.2**
- **Leaflet + React-Leaflet** for mapping
- **React-Range** for timeline slider
- **Ant Design** for UI components

### APIs & Data Sources
- **Open-Meteo API**: Weather data (temperature_2m field)
- Support for additional data sources (extensible architecture)

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation Steps

1. **Clone/Download the repository**
   ```bash
   git clone <repository-url>
   cd dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```
   Note: `--legacy-peer-deps` flag is needed to resolve React version conflicts with react-leaflet.

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Local: http://localhost:3000 (or next available port)

### Build for Production
```bash
npm run build
npm start
```

## 🗺 API Configuration

### Open-Meteo API
The application uses the Open-Meteo Archive API for weather data:

**Endpoint**: `https://archive-api.open-meteo.com/v1/archive`

**Example Usage**:
```javascript
const url = `https://archive-api.open-meteo.com/v1/archive?latitude=52.52&longitude=13.41&start_date=2025-07-18&end_date=2025-08-01&hourly=temperature_2m`
```

**No API Key Required**: Open-Meteo provides free access to weather data.

### Adding Additional Data Sources
To add more data sources:

1. **Extend DataSource interface** in `components/Dashboard.tsx`
2. **Add API fetch logic** in `components/MapComponent.tsx`
3. **Update sidebar** to configure new data sources
4. **Implement color rule calculations** for new data types

## 🎮 Usage Guide

### Step 1: Timeline Configuration
1. Choose between "Single Point" or "Time Range" mode
2. Drag the slider to select desired time window
3. View real-time updates of selected time/range

### Step 2: Drawing Polygons
1. Click "Draw Polygon" button in sidebar
2. Click on map to add polygon points (min 3, max 12)
3. Complete by clicking near start point or reaching max points
4. Polygon automatically fetches data and applies color rules

### Step 3: Data Source Management
1. Expand data source settings in sidebar
2. Configure color rules with operators (<, <=, =, >=, >)
3. Set threshold values and corresponding colors
4. Rules automatically apply to all polygons using that data source

### Step 4: Polygon Management
1. View all polygons in sidebar list
2. Click polygons on map to delete (with confirmation)
3. Monitor last fetched values for each polygon

## 🎨 Color Rule Configuration

Color rules determine polygon colors based on data values:

**Example Rules for Temperature**:
- `< 10°C` → Red (#ef4444)
- `>= 10°C AND < 25°C` → Blue (#3b82f6)  
- `>= 25°C` → Green (#10b981)

**Available Operators**: `<`, `<=`, `=`, `>=`, `>`
**Available Colors**: Red, Blue, Green, Yellow, Purple, Pink, Orange, Gray

## 📁 Project Structure

```
dashboard/
├── app/
│   ├── globals.css          # Global styles + Leaflet CSS
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/
│   ├── Dashboard.tsx        # Main dashboard component
│   ├── TimelineSlider.tsx   # Timeline control component
│   ├── MapComponent.tsx     # Leaflet map with polygon tools
│   └── DataSourceSidebar.tsx # Data source & polygon management
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Deploy automatically with zero configuration

### Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify

### Other Platforms
- Compatible with any platform supporting Next.js static export
- Ensure Node.js 18+ support for hosting environment

## 🔧 Environment Variables

No environment variables required for basic functionality. All APIs used are public and don't require authentication.

## 📱 Browser Support

- **Recommended**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Note**: Leaflet maps require modern browser with good JavaScript support

## 🤝 Contributing

This project was built for the Mind Webs Ventures internship evaluation. For modifications:

1. Fork the repository
2. Create feature branch
3. Make changes following existing code style  
4. Test thoroughly with polygon drawing and API integration
5. Submit pull request with detailed description

## 📋 Features Roadmap

### Completed ✅
- Timeline slider with single/range modes
- Interactive map with Leaflet
- Polygon drawing tools (3-12 points)
- Open-Meteo API integration  
- Color-coded data visualization
- Data source configuration
- Responsive design

### Bonus Features ✅
- Polygon deletion functionality
- Real-time data fetching
- Color rule management
- Dark theme design
- Mobile responsiveness

### Potential Enhancements
- [ ] Polygon editing (vertex manipulation)
- [ ] Additional data sources
- [ ] Data caching for performance
- [ ] Polygon import/export
- [ ] Advanced time zone handling

## 📞 Support

For questions regarding this implementation:
- Review the source code comments
- Check browser developer console for errors
- Ensure proper API connectivity
