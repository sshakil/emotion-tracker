Given('I am a user') do
  @user = FactoryBot.create(:user)
end

When('I log in with valid credentials') do
  visit new_user_session_path
  fill_in 'user[email]', with: @user.email
  fill_in 'user[password]', with: @user.password
  click_button 'Log in'
end

When('I log in with an invalid password') do
  visit new_user_session_path
  fill_in 'user[email]', with: @user.email
  fill_in 'user[password]', with: 'badpassword'
  click_button 'Log in'
end

Then('I should see the dashboard') do
  expect(current_path).to eq(root_path)
  expect(page).to have_content('Emotion Tracker')
  expect(page).to have_content('SELECT DATE')
end

Then('I should remain on the login page with an error') do
  expect(current_path).to eq(new_user_session_path)
  expect(page).to have_field('user[email]', with: @user.email)
  expect(page).to have_field('user[password]', with: '')
end