# Use an official Ruby runtime as a parent image
FROM ruby:3.2.0

# Set environment variables
ENV RAILS_ENV=production
ENV RAILS_LOG_TO_STDOUT=true

# Install dependencies
RUN apt-get update -qq && apt-get install -y \
  nodejs \
  npm \
  postgresql-client \
  build-essential \
  libpq-dev \
  vim \
  curl

# Set the working directory
WORKDIR /app

# Install bundler
RUN gem install bundler

# Copy the Gemfile and Gemfile.lock into the image
COPY Gemfile Gemfile.lock ./

# Install gems
RUN bundle install --without development test

# Copy the package.json and package-lock.json (if present)
COPY package.json package-lock.json ./

# Install node modules using npm
RUN npm install

# Copy the rest of the application code
COPY . .

# Precompile assets
RUN bundle exec rake assets:precompile

# Expose port 3000 to the Docker host
EXPOSE 3000

# Start the Rails server
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]