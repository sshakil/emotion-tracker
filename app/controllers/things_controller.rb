class ThingsController < ApplicationController
  def index
    render json: { :things => [
      {
        name: 'some-thing',
        guid: 'blaba'
      }
    ] }.to_json
  end
end
