# Your House TV

A Next.js application for managing TV networks, cities, channels, and stations with Docker deployment support.

## Prerequisites

- Node.js 22 or higher
- pnpm package manager
- Docker and Docker Compose (for production deployment)
- MongoDB database

## Environment Setup

1. Copy the environment example file:

```bash
cp .env.example .env
```

2. Update the `.env` file with your actual values:

```bash
# Database
DATABASE_URL="mongodb://your-mongodb-connection-string"

# ImageKit Configuration
NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imageio.io/your-endpoint
```

## Development Setup

1. Install dependencies:

```bash
pnpm install
```

2. Generate Prisma client:

```bash
pnpm db:generate
```

3. Push database schema (if needed):

```bash
pnpm db:push
```

4. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Production Deployment with Docker

1. Make sure you have your environment variables set up in your system or `.env` file.

2. Build and run with Docker Compose:

```bash
docker compose build --no-cache
docker compose up -d
```

3. Or use the provided setup script:

```bash
chmod +x docker-setup.sh
./docker-setup.sh
```

The application will be available at [http://localhost:3003](http://localhost:3003).

## Project Structure

- `app/` - Next.js app router pages and API routes
- `components/` - Reusable React components
- `prisma/` - Database schema and migrations
- `lib/` - Utility functions and configurations
- `types.ts` - TypeScript type definitions

## API Endpoints

- `/api/city` - City management (GET, POST, PUT, DELETE)
- `/api/network` - Network management
- `/api/gallery` - Gallery/media management
- `/api/get-videos` - Video retrieval
- `/api/server-time` - Server time synchronization

## Database Schema

The application uses MongoDB with Prisma ORM. Main entities:

- Networks
- Cities
- Channels
- Stations
- Vlogs
- Gallery
- Users

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Prisma ORM
- **UI**: Tailwind CSS, Radix UI components
- **Media**: ImageKit for image/video management
- **Deployment**: Docker

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push database schema changes
