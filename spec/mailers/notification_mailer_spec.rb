require 'rails_helper'

RSpec.describe NotificationMailer, type: :mailer do
  describe 'daily_email' do
    let(:user) { FactoryBot.create(:user, email: 'user@example.com') }
    let(:mail) { NotificationMailer.daily_email(user) }

    it 'renders the subject and recipient' do
      expect(mail.subject).to eq('Your Daily EmotionTracker Summary')
      expect(mail.to).to eq([user.email])
    end

    it 'renders the body' do
      expect(mail.body.encoded).to include('Your daily summary is ready.')
    end
  end
end
