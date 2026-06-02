FROM kong:latest

USER root

# 1. Create the plugins target directory structure inside the container
RUN mkdir -p /usr/local/share/lua/5.1/kong/plugins

# 2. 📑 FIXED: Copy the config folder from the immediate directory
COPY ./config /usr/local/kong/declarative

# 3. 📑 FIXED: Copy custom-plugins directly from the immediate directory
COPY ./custom-plugins /usr/local/share/lua/5.1/kong/plugins

# 4. Set the exact Kong runtime environment variables from your setup
ENV KONG_DATABASE="off"
ENV KONG_DECLARATIVE_CONFIG="/usr/local/kong/declarative/kong.yml"
ENV KONG_PROXY_ACCESS_LOG="/dev/stdout"
ENV KONG_ADMIN_ACCESS_LOG="/dev/stdout"
ENV KONG_PROXY_ERROR_LOG="/dev/stderr"
ENV KONG_ADMIN_ERROR_LOG="/dev/stderr"
ENV KONG_LOG_LEVEL="debug"
ENV KONG_PLUGINS="bundled,custom-auth"
ENV KONG_LUA_PACKAGE_PATH="/usr/local/share/lua/5.1/?.lua;;"

# 5. Overwrite the listening port so it binds publicly on port 8000 for Render
ENV KONG_PROXY_LISTEN="0.0.0.0:8000, 0.0.0.0:8443 ssl http2"

EXPOSE 8000