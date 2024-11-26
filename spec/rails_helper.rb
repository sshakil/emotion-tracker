require 'simplecov'
SimpleCov.start 'rails'

# Environment setup
ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'

abort("The Rails environment is running in production mode!") if Rails.env.production?

require 'spec_helper'
require 'rspec/rails'
require 'webmock/rspec'
require 'factory_bot'
require 'database_cleaner/active_record'

RSpec.configure do |config|
  config.use_transactional_fixtures = false

  # need to load this explicitly for some reason
  # FactoryBot.definition_file_paths = [File.expand_path('../spec/factories', __dir__)]
  # FactoryBot.find_definitions

  config.before(:suite) do
    DatabaseCleaner.clean_with(:truncation, except: ['sessions'])
    Rails.application.load_seed

    # FRONT-END ASSET REBUILDING
    puts "Rebuilding front-end assets for test environment..."
    system("NODE_ENV=test node esbuild.config.js") or abort("Asset build failed!")
  end

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
  config.before(:each) do |example|
    DatabaseCleaner.strategy = example.metadata[:js] ? :truncation : :transaction
    DatabaseCleaner.start
  end

  config.after(:each) do
    DatabaseCleaner.clean
  end

  config.filter_rails_from_backtrace!
  config.include Devise::Test::IntegrationHelpers
end