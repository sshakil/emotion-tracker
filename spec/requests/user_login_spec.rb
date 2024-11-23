require 'rails_helper'

RSpec.describe 'User Login', type: :request do
  it 'logs in successfully' do
    user = FactoryBot.create(:user, email: 'test@example.com', password: 'password')

    # Step 1: GET the login page to fetch the CSRF token
    get '/users/sign_in'
    expect(response).to have_http_status(:ok)

    # Extract the CSRF token
    csrf_token = Nokogiri::HTML(response.body).css('meta[name="csrf-token"]').first&.attribute('content')&.value
    raise "CSRF token not found in response" if csrf_token.nil?

    # Step 2: POST the login credentials with the CSRF token
    post '/users/sign_in',
         params: {
           user: {
             email: user.email,
             password: 'password'
           }
         },
         headers: {
           'X-CSRF-Token' => csrf_token
         }

    # Check for redirection
    expect(response).to have_http_status(:see_other) # 303 Redirect

    # Follow the redirect
    follow_redirect!

    # Verify the flash message
    expect(controller.flash[:notice]).to eq('Signed in successfully.')
  end
end