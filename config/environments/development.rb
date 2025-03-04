require "active_support/core_ext/integer/time"

ENV['BULLET_DEBUG'] = 'true'

Rails.application.configure do
  config.after_initialize do
    Bullet.enable        = true
    Bullet.alert         = true
    Bullet.bullet_logger = true
    Bullet.console       = true
    # Bullet.growl         = true
    Bullet.rails_logger  = true
    Bullet.add_footer    = true
  end

  config.log_level = :debug

  # Settings specified here will take precedence over those in config/application.rb.

  # Make code changes take effect immediately without server restart.
  config.enable_reloading = true

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports.
  config.consider_all_requests_local = true

  # Enable server timing.
  config.server_timing = true

  # Enable/disable Action Controller caching. By default Action Controller caching is disabled.
  # Run rails dev:cache to toggle Action Controller caching.
  if Rails.root.join("tmp/caching-dev.txt").exist?
    config.action_controller.perform_caching = true
    config.action_controller.enable_fragment_cache_logging = true
    config.public_file_server.headers = { "Cache-Control" => "public, max-age=#{2.days.to_i}" }
  else
    config.action_controller.perform_caching = false
  end

  # Change to :null_store to avoid any caching.
  config.cache_store = :memory_store

  # Store uploaded files on the local file system (see config/storage.yml for options).
  config.active_storage.service = :local

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  # Make template changes take effect immediately.
  config.action_mailer.perform_caching = false

  # Set localhost to be used by links generated in mailer templates.
  config.action_mailer.default_url_options = { host: "localhost", port: 3000 }

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Highlight code that triggered database queries in logs.
  config.active_record.verbose_query_logs = true

  # Append comments with runtime information tags to SQL queries in logs.
  config.active_record.query_log_tags_enabled = true

  # Highlight code that enqueued background job in logs.
  config.active_job.verbose_enqueue_logs = true

  # Raises error for missing translations.
  # config.i18n.raise_on_missing_translations = true

  # Annotate rendered view with file names.
  config.action_view.annotate_rendered_view_with_filenames = true

  # Uncomment if you wish to allow Action Cable access from any origin.
  # config.action_cable.disable_request_forgery_protection = true

  # Raise error when a before_action's only/except options reference missing actions.
  config.action_controller.raise_on_missing_callback_actions = true

  config.active_job.queue_adapter = :sidekiq

  # Serve files from the build directory
  config.public_file_server.enabled = true
  config.public_file_server.index_name = "index.html"
  config.public_file_server.headers = { "Cache-Control" => "no-cache" }

  # Only add non-symlinked directories under config/initializers/sidekiq to autoload paths
  config.autoload_paths +=
    Dir["#{config.root}/config/initializers/sidekiq/**/"]
      .reject { |path|
        File.symlink?(path)
      }

  config.active_record.logger = Logger.new(STDOUT)

  config.api_base_url = ENV.fetch('API_BASE_URL', 'http://localhost:3000')
  config.oauth_redirect_uri = URI.join(config.api_base_url, '/oauth/callback').to_s
  config.redis_url = ENV.fetch('REDIS_URL', 'redis://localhost:6379/0')

  config.jobs_file = Rails.root.join('config', 'initializers', 'sidekiq', 'jobs.json')
  # config.jobs_file = Rails.root.join('config', 'sidekiq', 'jobs.json')
end