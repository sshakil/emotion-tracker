class NotificationMailer < ApplicationMailer
  def daily_email(user)
    @user = user
    mail(to: @user.email, subject: 'Your Daily EmotionTracker Summary', layout: false)
  end
end
