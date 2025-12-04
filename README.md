# ♟️ Chessio

An interactive chess learning platform where users master chess through structured lessons, earn XP, and level up their skills.

## Features

- 🎯 **Interactive Lessons** - Step-by-step chess lessons with real-time board interaction
- 📈 **XP & Leveling** - Gamified progression system to track your improvement
- 💡 **AI Hints** - Get contextual hints when you're stuck
- 🔐 **Authentication** - Secure sign-in with GitHub, Google, or email
- 📊 **Progress Tracking** - Resume lessons and track completed content

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth v5
- **Chess**: chess.js + react-chessboard
- **Styling**: Tailwind CSS
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chessio.git
   cd chessio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and auth secrets
   ```

4. Set up the database:
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   └── lessons/           # Lesson pages
├── components/
│   ├── chess/             # Chess-specific components
│   └── ui/                # Reusable UI components
└── lib/
    ├── auth.ts            # NextAuth configuration
    ├── db.ts              # Prisma client
    ├── lessons/           # Lesson logic & types
    └── gamification/      # XP/Level system
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed sample lessons |
| `npm run db:studio` | Open Prisma Studio |

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure TypeScript compiles without errors
4. Submit a pull request

## License

MIT
