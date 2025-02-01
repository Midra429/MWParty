# https://clerk.com/docs/deployments/deploy-chrome-extension

source "$(dirname "$0")/.env"

curl -X PATCH https://api.clerk.com/v1/instance \
  -H "Authorization: Bearer $CLERK_SECRET_KEY" \
  -H "Content-type: application/json" \
  -d "{
    \"allowed_origins\": [
      \"chrome-extension://$CHROME_EXTENSION_ID\",
      \"moz-extension://$FIREFOX_EXTENSION_ID\"
    ]
  }" \
  -w "%{http_code}\n"
