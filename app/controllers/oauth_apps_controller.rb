# frozen_string_literal: true

class OauthAppsController < ApplicationController
  # Skip authentication for this action since it's for the public OAuth `uid`
  skip_before_action :authenticate_user!, raise: false

  def public_uid
    application = Doorkeeper::Application.find_by(name: 'Web')
    if application
      render json: { uid: application.uid }
    else
      render json: { error: 'Application not found' }, status: :not_found
    end
  end
end