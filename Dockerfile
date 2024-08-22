# Use an official Ruby runtime as a parent image
FROM ruby:3.2.0

# Install Node.js 16.x (or newer) and PostgreSQL client
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs postgresql-client build-essential libpq-dev vim curl

# Set the working directory
WORKDIR /app

# Set RAILS_ENV to development by default
ARG RAILS_ENV=development
ENV RAILS_ENV=$RAILS_ENV

# Install bundler
RUN gem install bundler

# Copy the Gemfile and Gemfile.lock into the image
COPY Gemfile Gemfile.lock ./

# Install gems based on the RAILS_ENV
RUN bundle install --with development test

# Copy the package.json and package-lock.json (if present)
COPY package.json package-lock.json ./

# Install node modules using npm
RUN npm install

# Copy the rest of the application code
COPY . .

# Precompile assets only in production
RUN if [ "$RAILS_ENV" = "production" ]; then npm run build && bundle exec rake assets:precompile; fi

# Expose port 3000 to the Docker host
EXPOSE 3000

# Start the Rails server with migrations and seeding
CMD ["bash", "-c", "bundle exec rails db:migrate && bundle exec rails db:seed && bundle exec puma -C config/puma.rb"]