# Create a default user
default_user = User.find_or_create_by!(email: 'saadshakil@gmail.com') do |user|
  user.password = 'password'
  user.password_confirmation = 'password'
end

# Update `user_id` for existing DayPeriod, Day, and Entry records
# puts "Updating user_id for DayPeriods, Days, and Entries to default_user (ID: #{default_user.id})..."
#
# DayPeriod.where(user_id: nil).update_all(user_id: default_user.id)
# Day.where(user_id: nil).update_all(user_id: default_user.id)
# Entry.where(user_id: nil).update_all(user_id: default_user.id)
#
# puts "DayPeriods, Days, and Entries updated successfully."

# Create a default Doorkeeper Application
application = Doorkeeper::Application.find_or_create_by!(name: 'Web') do |app|
  app.redirect_uri = Rails.application.config.oauth_redirect_uri
  app.scopes = 'read write public'
  app.confidential = false
end

# Create a default access token for the user
Doorkeeper::AccessToken.find_or_create_by!(
  resource_owner_id: default_user.id,
  application_id: application.id
) do |token|
  token.expires_in = 2.hours
  token.scopes = 'public read write'
end

period_names = ['Early Morning', 'Morning', 'Afternoon', 'Evening', 'Before Bed']
period_names.each do |name|
  Period.find_or_create_by!(name: name)
end

puts "Default application and access token created successfully."