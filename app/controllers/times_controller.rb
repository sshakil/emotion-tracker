class TimesController < ApplicationController
  def index
    render json: { :times => [
      {
        name: 'Early Morning',
        guid: 'early-morning',
        emotions: %w[ok inspired]
      },
      {
        name: 'Morning',
        guid: 'morning',
        emotions: %w[fine]
      },
      {
        name: 'Afternoon',
        guid: 'afternoon',
        emotions: %w[annoyed tolerant]
      },
      {
        name: 'Evening',
        guid: 'evening',
        emotions: %w[irked cool vigilant]
      },
      {
        name: 'Before Bed',
        guid: 'before-bed',
        emotions: %w[grateful]
      }
    ] }.to_json
  end
end
