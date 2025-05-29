# The Unfinished Mandate

**Tracking the implementation status of Australian Royal Commission recommendations**

The Unfinished Mandate is a comprehensive web platform that tracks recommendations from Australian Royal Commissions and government inquiries, providing transparent reporting on their implementation status. This platform serves as the definitive public ledger for holding governments accountable to the vital recommendations that shape policy and protect communities.

## 🎯 The Problem

Australia invests substantial resources in Royal Commissions and inquiries, generating vital recommendations aimed at addressing systemic issues, protecting vulnerable communities, and improving public services. Yet, a significant number of these recommendations remain unimplemented, often gathering dust in bureaucratic silos.

This leads to continued harm and erosion of public confidence. The "mandate for change" often remains tragically unfulfilled, while new governments assume office claiming fresh mandates without addressing the unfinished business of the past.

## 🔍 Platform Features

### Comprehensive Tracking
A robust database detailing recommendations from key Australian inquiries, including their current status from acceptance to implementation.

### Transparent Reporting  
Intuitive visualizations and clear data presentations that highlight implementation gaps and areas of concern.

### Actionable Insights
Easily discover and share specific unimplemented recommendations, fostering public advocacy and direct engagement with decision-makers.

### Key Functionality
- **Browse Commission Reports**: View detailed information about Royal Commissions and their recommendations
- **Discover Unimplemented Recommendations**: Use the random discovery feature to explore unfulfilled mandates
- **Implementation Status Tracking**: Clear indicators showing acceptance and implementation status
- **Professional Interface**: Clean, accessible design prioritizing clarity and credibility
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🎨 Design Philosophy

The Unfinished Mandate adopts a professional, authoritative design approach that emphasizes clarity and credibility:
### Design Principles

- **🎯 Clarity Over Complexity**: Every design decision prioritizes user understanding. Complex political information becomes accessible without losing nuance.
- **⚖️ Authority Through Evidence**: Visual hierarchy and typography establish credibility. Data speaks louder than opinion.
- **🔥 Urgency Without Panic**: Design creates momentum for action while maintaining rational, informed discourse.
- **🌈 Optimism in Accountability**: Colorful elements represent the vibrant democracy we're fighting for, not just the problems we're solving.

## 🎨 Visual Identity

The platform uses a professional design system featuring:
- **Typography**: Inter for interface elements and Crimson Text for content
- **Color Palette**: Navy primary (#2c3e50) with red accents (#e74c3c)
- **Status Indicators**: Clear visual indicators for implementation status
- **Clean Layout**: Focused on readability and accessibility

## 📊 Data Structure

Each commission is stored as a JSON file in the `public/` directory. The platform supports both legacy flat structures and new categorized formats:

### New Categorized Format
```json
{
  "name": "Commission Name",
  "summary": "Brief overview of the commission's purpose",
  "findings": "Key findings from the inquiry",
  "year": 2023,
  "totalRecommendations": 25,
  "implementationStatus": {
    "fullyImplemented": 5,
    "partiallyImplemented": 8,
    "notImplemented": 10,
    "notAccepted": 2
  },
  "categories": [
    {
      "name": "Category Name",
      "description": "Category description",
      "recommendations": [
        {
          "id": 1,
          "recommendation": "The recommendation text",
          "notes": "Implementation notes or details",
          "accepted": true,
          "implemented": "partial"
        }
      ]
    }
  ],
  "keyOutcomes": ["Outcome 1", "Outcome 2"],
  "ongoingChallenges": ["Challenge 1", "Challenge 2"]
}
```

### Legacy Format
```json
{
  "name": "Commission Name", 
  "summary": "Brief overview",
  "findings": "Key findings",
  "recommendations": [
    {
      "recommendation": "The recommendation text",
      "details": "Additional context",
      "accepted": true,
      "implemented": false
    }
  ]
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd royal-commission-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5176/royal-commission-tracker/`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to GitHub Pages.

### Assets for GitHub Pages

Images and other static assets should be placed in the `public/` directory to ensure they work correctly on GitHub Pages. The banner image is located at `public/The-Unfinished-Mandate-banner.png`.

## 📁 Adding New Commissions

1. Create a new JSON file in the `public/` directory following the data structure above
2. Add the file reference to the `commissionFiles` array in `src/Home.svelte`:

```javascript
let commissionFiles = [
  { name: 'Your Commission Name', file: 'your-commission-file.json' },
  // ... existing commissions
];
```

## 🌟 Our Vision

We believe that by shining a spotlight on the "unfinished mandates," we can compel governments to act, rebuild public trust, and ultimately contribute to a more just and responsive Australia.

## 🛠 Technology Stack

- **Frontend**: Svelte + Vite
- **Styling**: Tailwind CSS v3
- **Routing**: svelte-spa-router
- **Deployment**: GitHub Pages
- **Data Storage**: Static JSON files

## 📜 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to:
- Add new commission data following the established format
- Improve the user interface and accessibility
- Enhance data visualization and reporting features  
- Report bugs or suggest new features
- Help with documentation and user guides

### Join the Movement for Accountability

Help us shine a spotlight on unfinished mandates and compel governments to act on the recommendations that matter most to Australian communities.

---

*"Empowering accountability in Australian governance through transparent tracking of Royal Commission recommendations"*
