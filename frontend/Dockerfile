FROM node:18-alpine as build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Add build-time ARG for API URL
ARG REACT_APP_API_URL=http://localhost/api
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

RUN npm run build

# Create env-config.js for runtime configuration
RUN echo "window._env_ = {REACT_APP_API_URL: '${REACT_APP_API_URL}'};" > /app/build/env-config.js

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Add script to update env-config.js at container startup
COPY --from=build /app/build/env-config.js /usr/share/nginx/html/env-config.js
RUN echo $'#!/bin/sh\n\
sed -i "s|window._env_ = {REACT_APP_API_URL: \'.*\'};|window._env_ = {REACT_APP_API_URL: \'$REACT_APP_API_URL\'};|g" /usr/share/nginx/html/env-config.js\n\
nginx -g "daemon off;"\
' > /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

EXPOSE 80

CMD ["/docker-entrypoint.sh"] 