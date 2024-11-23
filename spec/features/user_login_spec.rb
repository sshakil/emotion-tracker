require 'rails_helper'

RSpec.feature 'User login', type: :feature do
  scenario 'valid login', js:true do

    user = FactoryBot.create(
      :user,
      password: 'password',
      email: 'test@example.com',
    )

    visit new_user_session_path

    fill_in 'user[email]', with: user.email
    fill_in 'user[password]', with: 'password'

    click_button 'Log in'

    expect(page).to have_content('Emotion Tracker')
    expect(page).to have_content('SELECT DATE')

  end

end
