# Crypto Trading Journal Frontend

A Next.js 14 application for tracking and analyzing cryptocurrency trades.

## Features

- User authentication with JWT
- Trade management and tracking
- Portfolio analytics
- Responsive design with Tailwind CSS
- Form validation with Zod
- Material UI components

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Update the environment variables in `.env.local`

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
frontend/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── public/             # Static assets
└── styles/             # Global styles
```

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: Material UI
- **Forms**: React Hook Form
- **Validation**: Zod
- **HTTP Client**: Axios
- **Authentication**: JWT with js-cookie
- **Linting**: ESLint

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint