require 'rails_helper'

RSpec.feature 'User login', type: :feature do
  scenario 'valid login', js: true do
    user = FactoryBot.create(:user)

    visit new_user_session_path
    expect(current_path).to eq(new_user_session_path)

    fill_in 'user[email]', with: user.email
    fill_in 'user[password]', with: user.password

    click_button 'Log in'

    expect(current_path).to eq(root_path)
    expect(page).to have_content('Emotion Tracker')
    expect(page).to have_content('SELECT DATE')
  end

  scenario 'invalid login' do
    user = FactoryBot.create(:user)

    visit new_user_session_path

    fill_in 'user[email]', with: user.email
    fill_in 'user[password]', with: "badpassword"

    click_button 'Log in'

    expect(current_path).to eq(new_user_session_path)
    expect(page).to have_field('user[email]', with: user.email)
    expect(page).to have_field('user[password]', with: '')
  end
end