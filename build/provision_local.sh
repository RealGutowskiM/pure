echo "Pre-configuring software..."

echo "Node..."
curl -sL https://deb.nodesource.com/setup_14.x | bash -

echo "Updating apt..."
apt update

echo "Installing software..."
apt upgrade -yq
apt install -yq build-essential nodejs
npm i -g pm2