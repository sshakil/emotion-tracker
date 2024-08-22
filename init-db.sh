#!/bin/bash

# Check if the database has already been initialized
psql -d emotion_tracker -c '\dt' | grep -q 'No relations found'
if [ $? -eq 0 ]; then
  echo "Initializing database..."

  # Create the databases
  createdb emotion_tracker
  createdb emotion_tracker_test

  # Set up the demo user and grant permissions
  psql -d emotion_tracker -c "CREATE USER demo WITH PASSWORD 'P@ssword!1';"
  psql -d emotion_tracker -c "GRANT ALL PRIVILEGES ON DATABASE emotion_tracker TO demo;"
  psql -d emotion_tracker -c "GRANT ALL PRIVILEGES ON SCHEMA public TO demo;"
  psql -d emotion_tracker -c "ALTER SCHEMA public OWNER TO demo;"
  psql -d emotion_tracker -c "GRANT CREATE ON SCHEMA public TO demo;"
  psql -d emotion_tracker -c "ALTER DATABASE emotion_tracker OWNER TO demo;"

  echo "Database initialization complete."
else
  echo "Database already initialized."
fi