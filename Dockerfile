FROM node:20-alpine AS dev
WORKDIR /app
COPY . .
RUN npm ci
EXPOSE 5173
CMD ["npm", "run", "dev"]
