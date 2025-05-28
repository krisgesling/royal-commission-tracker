# The Redacted Truth

**Uncovering the classified reality of Australian Royal Commission recommendations and their implementation status**

The Redacted Truth is a sophisticated web application that tracks recommendations from Australian Royal Commissions and government inquiries, presenting them through the lens of classified document disclosure. This satirical approach highlights the often poor implementation rates of serious government recommendations by styling the interface as if you're accessing declassified government files.

## 🔍 Features

- **Classified Document Interface**: Browse commission findings styled as official government documents with security classifications
- **Declassified Random Access**: Click "DECLASSIFY RANDOM FINDING" to access a random unimplemented recommendation from the archives
- **Detailed File Access**: View comprehensive commission reports with official document styling and security headers
- **Implementation Tracking**: Clear status indicators showing which recommendations have been accepted and implemented
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Document Aesthetics**: Subtle background patterns and typography that evoke official government documentation

## 🎨 Design Philosophy

The Redacted Truth adopts a "declassified document" aesthetic that transforms bureaucratic data into something that feels like accessing classified intelligence. Key design elements include:

- **Redaction Bars**: Stylized black bars that suggest information being revealed or concealed
- **Official Stamps**: Status indicators designed to look like government document stamps
- **Security Classifications**: Headers and labels that mimic real classified document formatting
- **Monospace Typography**: Computer terminal and official document inspired fonts
- **Archival Scanning**: Loading animations that suggest documents being processed through official systems

## 📊 Data Structure

Each commission is stored as a JSON file in the `public/` directory with this structure:

```json
{
  "name": "Commission Name",
  "summary": "Brief overview of the commission's purpose",
  "findings": "Key findings from the inquiry", 
  "recommendations": [
    {
      "id": 1,
      "recommendation": "The recommendation text",
      "details": "Additional context or specifics",
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

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 📁 Adding New Commissions

1. Create a new JSON file in the `public/` directory following the data structure above
2. Add the file reference to the `commissionFiles` array in `src/App.svelte`:

```javascript
let commissionFiles = [
  { name: 'Your Commission Name', file: 'your-commission-file.json' },
  // ... existing commissions
];
```

## 🎯 The Concept

The Redacted Truth presents a sobering reality: despite numerous well-funded government inquiries producing hundreds of carefully researched recommendations, implementation rates remain disappointingly low. By presenting this information through the aesthetic of classified document disclosure, the site draws attention to the gap between public inquiry and actual policy implementation.

The "declassified" framing serves multiple purposes:
- Makes bureaucratic data more engaging and accessible
- Suggests that poor implementation is an "open secret" 
- Creates visual interest through document-inspired design
- Highlights the serious nature of unimplemented recommendations

## 🛠 Technology Stack

- **Frontend**: Svelte + Vite
- **Styling**: Tailwind CSS v4
- **Deployment**: GitHub Pages
- **Data Storage**: Static JSON files

## 📜 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to:
- Add new commission data
- Improve the document styling and user interface
- Enhance the declassified document aesthetic
- Report bugs or suggest features

---

*Security Classification: UNCLASSIFIED*
