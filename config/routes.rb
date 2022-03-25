Rails.application.routes.draw do
  resources :days
  resources :entries
  resources :periods

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
  root "static#index"

  get 'times', to: 'times#index', defaults: { format: 'json' }
end
