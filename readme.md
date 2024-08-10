# Farm Store Bot

Farm Store Bot is a Slack bot that allows users to buy and sell farm items using the `@hackclub/bag` package. Users can make offers, set prices for items, and trade using a simple command interface.

## Features

- **Make Offers**: Users can make offers for farm items.
- **Set Prices**: Admins can set prices for different farm items.

### `usage.md` - Detailed Instructions for Using Farm Store Bot

---

## Prerequisites

1. **Node.js**: Ensure Node.js (v14 or higher) is installed.
2. **Docker**: Install Docker and Docker Compose for containerization.
3. **Slack App**: Create a Slack app with the required permissions and tokens.
4. **PostgreSQL Database**: Set up a PostgreSQL database.

## Dependencies

- `@slack/bolt`
- `@prisma/client`
- `@bufbuild/protobuf`
- `@connectrpc/connect`
- `dotenv`
- `typescript`

Install these using:

```bash
npm install
```

## Database Setup

1. **PostgreSQL**: Install PostgreSQL and create a database.
2. **Prisma**: Generate and apply migrations:

```bash
npx prisma migrate dev
```

Update the `DATABASE_URL` in `.env` to reflect your PostgreSQL setup:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/farm_store
```

## Environment Variables

Create a `.env` file in the root directory with the following:

```env
SLACK_SIGNING_SECRET=your_slack_signing_secret
SLACK_APP_TOKEN=your_slack_app_token
SLACK_BOT_TOKEN=your_slack_bot_token
DATABASE_URL=your_database_url
SLACK_CHANNEL=your_slack_channel_id
```

## Running the Bot Locally

1. **Start the Bot**:

```bash
npm start
```

2. **Port Details**: The bot runs on port 3000 by default. Ensure this port is open or modify it in your Docker Compose or `.env` file.

## Docker Setup

1. **Build the Docker Image**:

```bash
docker-compose up --build
```

This will build and start the bot in a container, exposing port 3000.

## Usage

- **Buy Items**: `/farmshop buy`
- **Set Item Price**: `/farmshop setprice <item> <price>`
- **View Items**: The bot will periodically send updates to the Slack channel.

## Commands

- **Make an Offer**: `/farmshop offer <item> <price>`
- **Set Item Price**: `/farmshop setprice <item> <price>`

