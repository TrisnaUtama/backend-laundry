FROM oven/bun

WORKDIR /app

COPY ./package.json .
COPY ./prisma .

RUN bun install --ignore-scripts
RUN bunx prisma generate

COPY . .

EXPOSE 8000

CMD ["sh", "-c" , "bunx prisma db push && bunx prisma db seed && bun run ./src/index.ts"]
