echo "Running migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma
echo "Starting server..."
node dist/server.js