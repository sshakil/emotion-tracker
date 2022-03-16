class TimesController < ApplicationController
  def index
    render json: { :times => [
      {
        name: 'morning',
        guid: 'blaba'
      }
    ] }.to_json
  end
end
