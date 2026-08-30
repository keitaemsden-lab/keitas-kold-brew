# Build the Vite SPA, serve it with Caddy carrying the security headers from
# the repo's Caddyfile — replaces the nixpacks static build whose nginx config
# could only be header-patched by hand inside the running container (the
# familyfinance failure class; see Caddyfile note). Same pattern as
# GhrimPrints' gp.emsden.studio, proven durable on this Coolify host.
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /usr/share/caddy/
EXPOSE 80
