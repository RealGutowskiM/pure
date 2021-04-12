#!/bin/bash
echo "Pre-configuring software..."

echo "Updating apt-get..."
apt-get update > /dev/null
apt-get upgrade -y > /dev/null

echo "Node..."
if ! command -v node &> /dev/null
then
	echo "Installing..."
	curl -sL https://deb.nodesource.com/setup_14.x | bash - > /dev/null
	apt-get install -y build-essential nodejs > /dev/null
else
	echo "Already installed..."
fi

echo "PM2..."
if ! command -v pm2 &> /dev/null
then
	echo "Installing..."
	npm i -g pm2 > /dev/null
else
	echo "Already installed..."
fi