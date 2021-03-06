FROM alpine:latest

# Set up node
ENV NODE_ENV=production
RUN apk add nodejs npm

# Set up volume
RUN mkdir -p /data
VOLUME ["/data"]

# Copy project files
RUN mkdir -p /opt/matrix-token-registration
WORKDIR /opt/matrix-token-registration
COPY build/ ./
COPY packages/backend/package.json packages/backend/package-lock.json ./

# Install production dependencies
RUN npm ci --only=production

CMD ["node", "index.js"]
