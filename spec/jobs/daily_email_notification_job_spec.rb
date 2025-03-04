require 'rails_helper'

RSpec.describe DailyEmailNotificationJob, type: :job do
  it 'sends emails to all users' do
    # Arrange: Create test users
    FactoryBot.create(:user, email: 'user1@example.com')
    FactoryBot.create(:user, email: 'user2@example.com')

    # Act: Perform the job immediately (don't need Sidekiq, as just testing the job)
    # 3 as there's currently a default user, so 2 + 1
    expect {
      DailyEmailNotificationJob.perform_now
    }.to change { ActionMailer::Base.deliveries.count }.by(3)
  end
end
