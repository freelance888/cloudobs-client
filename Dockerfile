FROM node:14-alpine AS builder
USER node

WORKDIR /app
ADD . .

RUN stat /app
RUN chown node:node /app && rm -rf ./node_modules
RUN npm install

# COPY --chown=node:node --from=builder /wiki/node_modules ./node_modules

# VOLUME ["/app/.env"]

EXPOSE 3000

# HEALTHCHECK --interval=30s --timeout=30s --start-period=30s --retries=3 CMD curl -f http://localhost:3000/healthcheck

CMD ["npm", "start"]
