Given('There are registered users') do
  @user_1 = FactoryBot.create(:user)
  @user_2 = FactoryBot.create(:user)
end

When('The system initializes') do
end

Then('The daily notification job should be scheduled') do
  # Process queued jobs if not running inline
  # Sidekiq::Worker.drain_all if Sidekiq::Testing.fake?

  job = Sidekiq::Cron::Job.find('daily_email_notification')

  puts "daily_email_notification job: #{job.inspect}" # Debug output

  queue = Sidekiq::Queue.new
  puts "Sidekiq::Queue.new.to_a: #{queue.to_a.inspect}" # Debug output

  scheduled_jobs = Sidekiq::ScheduledSet.new
  puts "ScheduledSet.map.items: #{scheduled_jobs.map(&:item).inspect}"

  expect(job).not_to be_nil
end

Then('All users should be notified') do
  # Allow time for the job to be queued and processed
  # sleep(65) # Wait for the cron to trigger

  # Process queued jobs
  Sidekiq::Worker.drain_all

  # 3 as there's currently a default user, so 2 + 1
  expect(ActionMailer::Base.deliveries.count).to eq(3)
end
