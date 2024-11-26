# Cucumber Rails integration
# Could be what loads FactoryBot without having to do so explicitely
require 'cucumber/rails'

require 'sidekiq/testing'

# Prevent Rails from rescuing exceptions for debugging purposes
ActionController::Base.allow_rescue = false

# DATABASE CLEANER
DatabaseCleaner.allow_production = false
DatabaseCleaner.clean_with(:truncation, except: ['sessions'])
Rails.application.load_seed

Before do |scenario|
  # Dynamically set the cleaning strategy based on tags
  # see note in /spec/rails_helper.rb
  DatabaseCleaner.strategy = scenario.source_tag_names.include?('@javascript') ? :truncation : :transaction
  DatabaseCleaner.start
end

After do
  DatabaseCleaner.clean
end


# FRONT-END ASSET REBUILDING
puts "Rebuilding front-end assets for test environment..."
system("NODE_ENV=test node esbuild.config.js") or abort("Asset build failed!")


# CAPYBARA
Capybara.register_driver :selenium_chrome do |app|
  # Chrome options
  options = Selenium::WebDriver::Chrome::Options.new

  # Uncomment '--headless' to enable headless mode
  options.add_argument('--headless')
  options.add_argument('--disable-gpu')
  options.add_argument('--no-sandbox')
  options.add_argument('--disable-dev-shm-usage')

  # Enable browser logging
  options.add_option('goog:loggingPrefs', browser: 'ALL')

  Capybara::Selenium::Driver.new(app, browser: :chrome, options: options)
end

# Capybara server and app configuration
Capybara.default_driver = :selenium_chrome
Capybara.javascript_driver = :selenium_chrome
Capybara.server = :puma, { Silent: true } # Use Puma for tests
Capybara.server_host = 'localhost'
Capybara.server_port = 3001
Capybara.app_host = "http://#{Capybara.server_host}:#{Capybara.server_port}"


# SIDEKIQ
# queue jobs immediately in tests
Sidekiq::Testing.inline!