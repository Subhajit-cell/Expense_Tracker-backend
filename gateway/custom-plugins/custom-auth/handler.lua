local kong = kong
local http = require "resty.http"
local cjson = require "cjson.safe"

local CustomAuthHandler = {
  PRIORITY = 1000,
  VERSION = "1.0",
}

function CustomAuthHandler:access(config)
  local auth_service_url = config.auth_service_url

  -- 1. Get Authorization header
  local auth_header = kong.request.get_header("Authorization")

  if not auth_header then
    return kong.response.exit(401, { message = "Missing Authorization header" })
  end

  -- 2. Call Auth Service
  local httpc = http.new()
  httpc:set_timeouts(3000, 3000, 3000)

  local res, err = httpc:request_uri(auth_service_url, {
    method = "GET",
    headers = {
      ["Authorization"] = auth_header,
      ["Content-Type"] = "application/json"
    },
    keepalive = true
  })

  if not res then
    kong.log.err("Auth service call failed: ", err)
    return kong.response.exit(500, { message = "Auth service unreachable" })
  end

  -- 3. Unauthorized
  if res.status ~= 200 then
    return kong.response.exit(401, { message = "Unauthorized" })
  end

  -- 4. Parse JSON response
  local body, decode_err = cjson.decode(res.body)

  if not body then
    kong.log.err("Invalid JSON from auth service: ", decode_err)
    return kong.response.exit(500, { message = "Invalid auth response" })
  end

  -- 5. Extract user info
  local user_id = body.user_id
  local roles = body.roles or {}

  if not user_id then
    return kong.response.exit(403, { message = "Invalid user data" })
  end

  -- 6. Pass data to upstream services
  kong.service.request.set_header("X-User-ID", user_id)
  kong.service.request.set_header("X-User-Roles", table.concat(roles, ","))

  -- 7. Reuse connection (important)
  httpc:set_keepalive(60000, 10)
end

return CustomAuthHandler