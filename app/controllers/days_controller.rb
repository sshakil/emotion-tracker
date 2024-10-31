class DaysController < ApplicationController
  before_action -> { doorkeeper_authorize! :read, :write, :public }

  before_action :set_day, only: %i[ edit update destroy ]
  skip_before_action :verify_authenticity_token

  # GET /days or /days.json
  # controllers/days_controller.rb
  # app/controllers/days_controller.rb
  def index
    @days = Day.joins(day_periods: :entries)
               .distinct
               .order(date: :desc)
               .limit(30)

    render json: @days.as_json(
      include: {
        day_periods: {
          include: {
            entries: {
              include: { emotion: { only: :name } },
              only: [:id, :uuid, :day_period_id]
            }
          },
          only: [:id, :period_id]
        }
      },
      only: [:date]
    )
  end
  # GET /days/1 or /days/1.json or /days/fetch
  # todo: check if /days/<id> is used.. otherwise update comment
  # day_json = {} because: see https://stackoverflow.com/questions/22997327/should-i-return-null-an-empty-object-or-an-empty-array-for-json-with-no-data
  # to handle front sending format mm/dd/yyyy
  # needed format: yyyy-mm-dd
  # date = Time.strptime(params['date'], "%m/%d/%Y ")
  def show
    @day = Day.find_by(date: params['date'])
    day_json = {}

    unless @day.nil?
      # Perform a single query to fetch all necessary data without JSON aggregation in the DB
      data = ActiveRecord::Base.connection.execute(
        <<-SQL
      SELECT
        day_periods.id as dp_id,
        periods.name as period_name,
        entries.uuid as entry_uuid,
        emotions.name as emotion_name
      FROM day_periods
      INNER JOIN periods ON periods.id = day_periods.period_id
      INNER JOIN entries ON entries.day_period_id = day_periods.id
      INNER JOIN emotions ON emotions.id = entries.emotion_id
      WHERE day_periods.day_id = #{@day.id}
      ORDER BY day_periods.id
    SQL
      ).to_a

      # Group the data
      periods_json = data.group_by { |record| record['dp_id'] }.map do |_, records|
        {
          name: records.first['period_name'],
          emotions: records.map { |record| { name: record['emotion_name'], uuid: record['entry_uuid'] } }
        }
      end

      day_json = {
        date: @day.date.iso8601,
        periods: periods_json
      }
    end

    render json: day_json
  end

  # POST /days or /days.json
  def create
    errors = []
    created_entries = []
    begin
      @day = Day.find_or_create_by(date: params['day']['date'])
      if @day.nil?
        errors << "Invalid date"
      else
        params['day']['periods_attributes'].each do |period|
          @period = Period.find_by(name: period['name'])
          if @period.nil?
            errors << "Unknown period"
          else
            @day_period = DayPeriod.find_or_create_by(
              day: @day,
              period: @period
            )

            period['emotions_attributes'].each do |emotion|
              @emotion = Emotion.find_or_create_by(name: emotion['name'])

              @entry = Entry.find_or_create_by(
                day_period: @day_period,
                emotion: @emotion
              )

              created_entries << {
                uuid: @entry.uuid,
                emotion_name: @emotion.name,
                period_name: @period.name,
                date: @day.date.iso8601
              }
            end
          end
        end
      end

      if errors.empty?
        render json: { entries: created_entries }, status: :created
      else
        render json: { error: errors.as_json }, status: :bad_request
      end

    rescue StandardError => e
      render json: { error: e.as_json }, status: :internal_server_error
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
  def set_day
    @day = Day.find(params[:id])
  end

    # Only allow a list of trusted parameters through.
  def day_params
    params.require(:day).permit(:date, periods_attributes: [:name, emotions_attributes: [:name]])
  end

end
