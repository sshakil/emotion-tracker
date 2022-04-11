Rails.application.routes.draw do
  resources :days, shallow: true do
    resources :periods, shallow: true do
      resources :emotions
    end
  end

  # todo - error when moving this into the resource above (with 'days' removed)
  post 'days/fetch', to: 'days#show'

  resources :entries

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

end
