# raise "SIDEKIQ.RB LOADED"
$stdout.sync = true
puts ""
puts "SIDEKIQ.RB (puts) loaded in: #{defined?(Rails) ? Rails.env : 'undefined'}"
require 'logger'
logger = Logger.new($stdout)
logger.info("SIDEKIQ.RB (stdout logger) loaded in: #{defined?(Rails) ? Rails.env : 'undefined'}")
Sidekiq.logger.info("SIDEKIQ.RB (sidekiq logger) loaded in: #{Rails.env}")

require 'sidekiq'
require 'sidekiq-cron'
require 'sidekiq-status'
require 'sidekiq-unique-jobs'
require 'json'

# SERVER Redis configuration
Sidekiq.configure_server do |config|
  config.redis = { url: Rails.application.config.redis_url }

  # Enable Sidekiq-Status to track job progress and status
  Sidekiq::Status.configure_server_middleware config

  # Enable Sidekiq-Unique-Jobs to prevent duplicate job execution
  config.server_middleware do |chain|
    chain.add SidekiqUniqueJobs::Middleware::Server
  end

  # Load job schedule from env-specific JSON file
  schedule_file = Rails.application.config.jobs_file
  puts "Rails.application.config.jobs_file: ", Rails.application.config.jobs_file
  Rails.logger.info("Rails.application.config.jobs_file: #{Rails.application.config.jobs_file}")
  if File.exist?(schedule_file)
    puts "schedule_file: #{schedule_file}"
    schedule = JSON.parse(File.read(schedule_file))
    Sidekiq::Cron::Job.load_from_hash(schedule)
  end
end

# CLIENT config
Sidekiq.configure_client do |config|
  puts "Sidekiq.configure_client"
  Sidekiq.logger.info("Sidekiq.configure_client")
  config.redis = { url: Rails.application.config.redis_url }

  # Enable Sidekiq-Status for clients to fetch job progress
  Sidekiq::Status.configure_client_middleware config
  # same way, explicitly, if above doesn't work:
  # config.client_middleware do |chain|
  #   chain.add SidekiqUniqueJobs::Client::Middleware
  # end

  # Enable Sidekiq-Unique-Jobs for clients
  config.client_middleware do |chain|
    puts "Sidekiq.client_middleware"
    Sidekiq.logger.info("Sidekiq.client_middleware")
    chain.add SidekiqUniqueJobs::Middleware::Client
    puts "SidekiqUniqueJobs::Client::Middleware configured"
  end
end

# Sidekiq-Unique-Jobs configuration
SidekiqUniqueJobs.configure do |config|
  config.lock_timeout = 0 # Default timeout for acquiring locks
  config.lock_ttl = 900 # Time-to-live for locks in seconds (15 minutes, presuming typical 10-12 minute job)
end