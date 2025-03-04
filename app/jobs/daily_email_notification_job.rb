class DailyEmailNotificationJob < ApplicationJob
  queue_as :default

  def perform
    User.find_each do |user|
      NotificationMailer.daily_email(user).deliver_later
    end
  end
end
