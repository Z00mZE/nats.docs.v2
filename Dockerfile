FROM node:alpine AS build

WORKDIR /app
ENV CI=true

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

FROM nginx:alpine-slim AS runtime

RUN rm -f /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

# Start nginx directly, without the base image's entrypoint scripts and logs.
ENTRYPOINT ["nginx", "-e", "/dev/null"]
CMD ["-g", "daemon off;"]
