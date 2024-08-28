# frozen_string_literal: true

Doorkeeper.configure do
  orm :active_record

  resource_owner_authenticator do
    current_user || warden.authenticate!(scope: :user)
  end

  admin_authenticator do
    if current_user
      head :forbidden unless current_user.admin?
    else
      redirect_to sign_in_url
    end
  end

  api_only

  access_token_expires_in 2.hours

  custom_access_token_expires_in do |context|
    context.client.application.additional_settings[:custom_expiration] || 48.hours
  rescue NoMethodError
    48.hours
  end
  access_token_generator '::Doorkeeper::JWT'

  reuse_access_token

  revoke_previous_client_credentials_token

  use_refresh_token

  default_scopes  :public
  optional_scopes :write, :update

  grant_flows %w[authorization_code client_credentials password]

  realm "Doorkeeper"
end

Doorkeeper::JWT.configure do
  secret_key Rails.application.secret_key_base
  signing_method :hs256
end