FactoryBot.define do
  factory :user do
    email { Faker::Internet.email }
    password { 'password' }
    password_confirmation { 'password' } # Ensure password confirmation matches

    # # Optional traits for additional user configurations
    # trait :with_invalid_email do
    #   email { 'invalid_email' }
    # end
    #
    # trait :with_blank_password do
    #   password { '' }
    #   password_confirmation { '' }
    # end
  end
end