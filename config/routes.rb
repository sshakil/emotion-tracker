Rails.application.routes.draw do
  # adds:
  # Authorization (/oauth/authorize)
  # Token management (/oauth/token)
  # Revocation (/oauth/revoke)
  # Introspection (/oauth/introspect)
  # Admin Interface (/oauth/applications): Where you manage OAuth2 applications.
  use_doorkeeper

  devise_for :users
  root "static#index"

  # resources :day_periods
  # resources :emotions
  # resources :periods

  resources :entries, only: [:create, :destroy]

  resources :days, shallow: true do
    resources :periods, shallow: true do
    end
  end

  # todo - error when moving this into the resource above (with 'days' removed)
  post 'days/fetch', to: 'days#show'


  # resources :periods do
  #   resoruces :emotions
  # end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # forward all request to StaticController#index, but requests
  # # must be non-Ajax (!req.xhr?) and HTML Mime type (req.format.html7)
  # this does not include the root ("/") path.
  # basically, send all non-API requests to App component
  # (via StaticController#index)
  get '*page', to: 'static#index', constraints: ->(req) do
    !req.xhr? && req.format.html?
  end

  # Defines the root path route ("/")

end
