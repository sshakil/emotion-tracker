# frozen_string_literal: true

# This file is copied to spec/ when you run 'rails generate rspec:install'

# SimpleCov for test coverage
require 'simplecov'
SimpleCov.start 'rails'

require 'spec_helper'
require 'capybara/rspec'
require 'webmock/rspec'
require 'selenium/webdriver' # Ensure Selenium is loaded

# Capybara configuration with Selenium and Chrome
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

# Environment setup
ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'

abort("The Rails environment is running in production mode!") if Rails.env.production?

require 'rspec/rails'

# WebMock configuration
WebMock.disable_net_connect!(allow_localhost: true)

RSpec.configure do |config|
  config.include FactoryBot::Syntax::Methods

  # Disable transactional fixtures
  config.use_transactional_fixtures = false

  config.before(:suite) do
    DatabaseCleaner.clean_with(:truncation, except: ['sessions']) # Clears test DB
    Rails.application.load_seed # Seeds data for tests

    puts "Rebuilding front-end assets for test environment..."
    system("NODE_ENV=test node esbuild.config.js") or abort("Asset build failed!")
  end

  config.before(:each) do |example|
    # feature specs with logins will fail without this truncation/transaction
    # switch.
    #
    # The issue likely arises because DatabaseCleaner.strategy = :transaction
    # and DatabaseCleaner.start together are not compatible with your current
    # test environment setup. This is especially true if your tests are running
    # JavaScript (with js: true) or if you are using Selenium/WebDriver.
    # Here’s why:
    #
    # Transactional Cleanup: DatabaseCleaner.strategy = :transaction works by
    # wrapping your tests in a database transaction that gets rolled back after
    # the test. This requires all parts of the test to use the same database
    # connection.
    #
    # JavaScript Drivers: When using a JavaScript driver like Selenium, your
    # Rails app and the browser (controlled by Selenium) may run in separate
    # threads or processes, using separate database connections.
    # Transactions are not shared across connections, so the test may not
    # see data changes made inside the transaction.
    DatabaseCleaner.strategy = example.metadata[:js] ? :truncation : :transaction
    DatabaseCleaner.start
  end

  config.after(:each) do
    DatabaseCleaner.clean
  end

  # Infer spec types by location
  # config.infer_spec_type_from_file_location!

  config.filter_rails_from_backtrace!

  # Devise helpers for specs
  config.include Devise::Test::IntegrationHelpers
end