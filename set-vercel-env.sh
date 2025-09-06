#!/bin/bash

# Script to set Vercel environment variables

echo "Setting Vercel environment variables..."

# Add VITE_API_URL
vercel env add VITE_API_URL <<EOF
https://chat-backend-u3z3.onrender.com/api
EOF

# Add VITE_SOCKET_URL
vercel env add VITE_SOCKET_URL <<EOF
https://chat-backend-u3z3.onrender.com
EOF

# Add VITE_NODE_ENV
vercel env add VITE_NODE_ENV <<EOF
production
EOF

echo "Done! Now run 'vercel --prod' to deploy with the new environment variables."
