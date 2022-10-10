FROM node:14-alpine AS builder

WORKDIR /app
RUN chown node:node /app

USER node

ADD . .

RUN stat /app
RUN rm -rf ./node_modules
RUN npm install

# COPY --chown=node:node --from=builder /wiki/node_modules ./node_modules

EXPOSE 3000

# HEALTHCHECK --interval=30s --timeout=30s --start-period=30s --retries=3 CMD curl -f http://localhost:3000/healthcheck

CMD REACT_APP_BACKEND_PORT=${BACKEND_PORT} REACT_APP_FRONTEND_PORT={FRONTEND_PORT} npm run build
