# lib/tasks/populate.rake

namespace :db do
  desc "Populate the database with sample data for testing and development"
  task populate: :environment do
    # Configuration variables
    timestamp = Time.now
    entry_count_range = 0..15
    day_count = 30

    # logging lambda for readability
    log = ->(message) { puts "[#{Time.now}] #{message}" }

    begin
      # -------------------- users Table --------------------
      # Ensure at least one user exists
      log.call("Ensuring a user exists in the 'users' table...")
      user = User.find_or_create_by!(email: 'saadshakil@gmail.com') do |u|
        u.password = 'password'
        u.password_confirmation = 'password'
      end
      log.call("User ensured with email: #{user.email}")

      # -------------------- periods Table --------------------
      # Define and populate the periods table with the specified periods
      log.call("Populating 'periods' table...")
      period_names = ['Early Morning', 'Morning', 'Afternoon', 'Evening', 'Before Bed']
      periods = period_names.map { |name| Period.find_or_create_by!(name: name) }
      log.call("Ensured periods exist in 'periods' table: #{period_names.join(', ')}")

    rescue => e
      log.call("Error ensuring user or populating 'periods' table: #{e.message}")
      raise
    end

    begin
      # -------------------- emotions Table --------------------
      log.call("Loading emotions from YAML to populate 'emotions' table...")

      # Load all unique emotion nouns and adjectives from Faker's YAML file
      require 'yaml'
      faker_emotion_file = File.join(Gem.loaded_specs['faker'].full_gem_path, 'lib/locales/en/emotion.yml')
      emotion_data = YAML.load_file(faker_emotion_file)

      nouns = emotion_data['en']['faker']['emotion']['noun']
      adjectives = emotion_data['en']['faker']['emotion']['adjective']
      unique_emotions = (nouns + adjectives).uniq

      # Create Emotion records for all unique emotions
      emotions_to_create = unique_emotions.map { |emotion_name| Emotion.new(name: emotion_name, created_at: timestamp) }
      Emotion.import(emotions_to_create) # Batch insert for efficiency
      log.call("Added #{unique_emotions.size} unique emotions to 'emotions' table.")

    rescue => e
      log.call("Error loading or creating emotions in 'emotions' table: #{e.message}")
      raise
    end

    begin
      # -------------------- days and day_periods Tables --------------------
      log.call("Creating entries in 'days' and 'day_periods' tables...")

      # Create the current date first
      days = []
      day_periods = []

      current_day = Day.new(date: Date.today, user: user, created_at: timestamp)
      days << current_day

      # Create day_periods for each period for the current day
      periods.each do |period|
        day_periods << DayPeriod.new(day: current_day, period: period, user: user, created_at: timestamp)
      end

      # Create days for the past 30 days, with some randomly skipped
      (1..day_count).each do |i|
        # next if rand < 0.2 # Randomly skip some days

        day = Day.new(date: Date.today - i.days, user: user, created_at: timestamp)
        days << day

        # Create associated day_periods for each day and period combination
        periods.each do |period|
          day_periods << DayPeriod.new(day: day, period: period, user: user, created_at: timestamp)
        end
      end

      # Batch insert for Days and DayPeriods
      Day.import(days)
      DayPeriod.import(day_periods)
      log.call("Added #{days.size} days to 'days' table and #{day_periods.size} day periods to 'day_periods' table.")

    rescue => e
      log.call("Error creating entries in 'days' or 'day_periods' tables: #{e.message}")
      raise
    end

    begin
      # -------------------- entries Table --------------------
      log.call("Creating entries in 'entries' table...")

      emotion_ids = Emotion.pluck(:id)

      days.each do |day|
        entries = []

        # Ensure at least 3 unique day_periods have entries
        required_day_periods = day.day_periods.sample(3)
        required_day_periods.each do |day_period|
          entries << Entry.new(
            day_period: day_period,
            emotion_id: emotion_ids.sample,
            uuid: SecureRandom.uuid,
            user: day.user,
            created_at: timestamp
          )
        end

        # Add additional random entries, up to 15 total for the day
        additional_entries_count = rand(entry_count_range)
        additional_entries_count.times do
          entries << Entry.new(
            day_period: day.day_periods.sample,
            emotion_id: emotion_ids.sample,
            uuid: SecureRandom.uuid,
            user: day.user,
            created_at: timestamp
          )
        end

        # Batch insert for Entries
        Entry.import(entries)
        log.call("Added #{entries.size} entries for day #{day.date} to 'entries' table.")
      end

    rescue => e
      log.call("Error creating entries in 'entries' table: #{e.message}")
      raise
    end

    log.call("Database population completed successfully.")
  end
end