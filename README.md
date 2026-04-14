# GrowSmart Admin Dashboard

A modern, premium admin dashboard for business growth, analytics, and operations management.

## Features

- **Executive Overview**: Key business metrics at a glance with elegant cards
- **User Management**: Detailed user management with search and filters
- **Business Analytics**: Advanced visual analytics with interactive charts
- **Operations Dashboard**: Track projects, tasks, and team activities
- **Finance & Billing**: Manage invoices, payments, and financial metrics
- **Notifications Panel**: Real-time alerts, user issues, and pending actions

## Tech Stack

- React 18
- Tailwind CSS
- Recharts (for data visualization)
- Lucide React (icons)
- Vite (build tool)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The dashboard will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Design Features

- Modern SaaS-style admin dashboard
- Dark theme with glassmorphism cards
- Clean sidebar navigation
- Smooth transitions and hover animations
- Interactive charts and graphs
- Premium corporate design
- Responsive for desktop, tablet, and mobile
- Minimal and elegant typography
- Similar to Stripe, HubSpot, and Notion admin panels

## Project Structure

```
growsmart-dashboard/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── ExecutiveOverview.jsx
│   │   ├── UserManagement.jsx
│   │   ├── BusinessAnalytics.jsx
│   │   ├── OperationsDashboard.jsx
│   │   ├── FinanceBilling.jsx
│   │   └── NotificationsPanel.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── postcss.config.js
```

## Customization

### Colors

Colors are defined in `tailwind.config.js` under the `theme.extend.colors` section. You can customize the primary, accent, and dark theme colors to match your brand.

### Components

Each dashboard section is a separate component in `src/components/`. You can modify or extend these components to add new features.

### Charts

Charts are powered by Recharts. You can customize chart types, data, and styling in each analytics component.

## License

MIT
