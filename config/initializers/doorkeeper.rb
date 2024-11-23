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

  access_token_expires_in 48.hours

  access_token_generator '::Doorkeeper::JWT'

  reuse_access_token

  revoke_previous_client_credentials_token

  use_refresh_token

  default_scopes  :public
  optional_scopes :write, :update

  grant_flows %w[authorization_code client_credentials password]

  # skip_authorization can be configured to automatically approve access for certain applications.
  # Option 1: Auto-approve for trusted applications.
  # Example: skip_authorization { |resource_owner, client| client.trusted? }
  # Option 2: For applications that require pre-authorization, you'll need to implement
  # logic in the front-end to handle the pre-auth state. Typically, this involves:
  # - Displaying the pre-authorization form returned by the server.
  # - Handling the form submission to confirm the authorization.
  # - Resubmitting the OAuth request after confirmation.
  #
  # Skip authorization for trusted clients
  skip_authorization do |resource_owner, client|
    true
  end

  realm "Doorkeeper"

  # todo: temp
  # Allow HTTP redirect URIs in development and test environments
  force_ssl_in_redirect_uri false if Rails.env.development? || Rails.env.test?
end

Doorkeeper::JWT.configure do
  secret_key Rails.application.secret_key_base
  signing_method :hs256
end