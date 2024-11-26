Given('There are registered users') do
  @user_1 = FactoryBot.create(:user)
  @user_2 = FactoryBot.create(:user)
end

When('The system initializes') do
end

Then('The daily notification job should be scheduled') do
  expect(Sidekiq::Cron::Job.find('test_daily_email_notification')).not_to be_nil
end

Then('All users should be notified') do
  # Allow time for the job to be queued and processed
  # sleep(65) # Wait for the cron to trigger

  # Process queued jobs
  # Sidekiq::Worker.drain_all

  expect(ActionMailer::Base.deliveries.count).to eq(2)
end
