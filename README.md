# VMCD

```bash
# get from github
SECRET=GITHUB_SECRET
CLIENTID=GITHUB_CLIENTID

# generate keys
PK=$(openssl ecparam -name secp384r1 -genkey -noout | openssl pkcs8 -topk8 -nocrypt)
PK="${PK//$'\n'/\\n}"
PUB=$(echo "${PK}" | openssl ec -pubout)
PUB="${PUB//$'\n'/\\n}"

# generate config
CONFIG=$(cat << EOF
AUTH_GITHUB_CLIENT_ID = "$CLIENTID"
AUTH_GITHUB_CLIENT_SECRET = "$SECRET"
AUTH_GITHUB_CALLBACK_URI = "http://localhost:7448/api/auth/github/callback"
AUTH_JWT_PRIVATE_KEY = "$PK"
AUTH_JWT_PUBLIC_KEY = "$PUB"
AUTH_JWT_ISSUER = "whatever"
AUTH_JWT_AUDIENCE = "whatever"
EOF
)
echo "${CONFIG}" > .dev.vars

# run
pnpm install
pnpm dev
```