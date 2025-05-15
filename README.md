# Employee Portal

A modern, feature-rich intranet portal for employee self-service and workplace management.

![Employee Portal Screenshot](https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

## Features

### Time & Leave Management
- 📅 Time tracking with daily entries
- 🏖️ Leave management (vacation, sick, personal)
- ⏰ Recuperation time tracking
- 📊 Detailed statistics and reports

### Resource Booking
- 🚗 Vehicle reservation system
- 🏢 Meeting room booking
- 📅 Calendar integration with Microsoft Teams
- 📍 Location-based availability

### Expense Management
- 💳 Expense tracking and reporting
- 📸 OCR receipt scanning
- 💰 Multiple currency support
- 📊 Expense analytics

### Support & Services
- 🎫 IT support ticket system
- 🚨 Incident reporting
- 📱 Mobile plan management
- 💻 Equipment management
- 🛡️ Antispam protection

### Document Management
- 📄 Document repository
- 📂 File categorization
- 🔍 Advanced search
- 📊 Version control

### Employee Directory
- 👥 Company directory
- 💬 Teams integration
- 📞 Contact information
- 📍 Office locations

## Technology Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS
  - Boosted (Orange Design System)
  - Chart.js
  - FullCalendar
  - Tesseract.js (OCR)

- **UI Components:**
  - Lucide React (Icons)
  - Custom components

- **State Management:**
  - React Context API
  - Custom hooks

- **Form Handling:**
  - React Hook Form

- **Date Handling:**
  - date-fns

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/employee-portal.git
cd employee-portal
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Project Structure

```
employee-portal/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/       # React Context providers
│   ├── pages/         # Page components
│   ├── types/         # TypeScript type definitions
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── public/            # Static assets
└── package.json       # Project dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Orange Design System (Boosted)](https://boosted.orange.com/)
- [Lucide Icons](https://lucide.dev/)
- [FullCalendar](https://fullcalendar.io/)
- [Tesseract.js](https://tesseract.projectnaptha.com/)