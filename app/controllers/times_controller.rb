class TimesController < ApplicationController
  def index
    render json: { :times => [
      {
        name: 'morning',
        guid: 'from-back-end'
      }
    ] }.to_json
  end
end
