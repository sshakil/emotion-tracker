class ApplicationController < ActionController::Base
  protect_from_forgery unless: -> { request.path == '/users/sign_out' && request.delete? }
end
