#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Test MongoDB connection
python test_mongodb.py

# Start the bot
python bot.py 