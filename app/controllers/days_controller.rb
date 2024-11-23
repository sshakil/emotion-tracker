class DaysController < ApplicationController
  before_action -> { doorkeeper_authorize! :read, :write, :public }
  before_action :set_current_user
  before_action :set_day, only: %i[edit update destroy]
  skip_before_action :verify_authenticity_token

  # GET /days or /days.json
  def index
    @days = Day.where(user: @current_user)
               .joins(day_periods: :entries)
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

  # GET /days/1 or /days/1.json
  def show
    @day = Day.find_by(date: params['date'], user: @current_user)
    day_json = {}

    unless @day.nil?
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
      @day = Day.find_or_create_by!(date: params['day']['date'], user: @current_user)
      if @day.nil?
        errors << "Invalid date"
      else
        params['day']['periods_attributes'].each do |period|
          @period = Period.find_by(name: period['name'])
          if @period.nil?
            errors << "Unknown period"
          else
            @day_period = DayPeriod.find_or_create_by!(
              day: @day,
              period: @period,
              user: @current_user
            )

            period['emotions_attributes'].each do |emotion|
              @emotion = Emotion.find_or_create_by(name: emotion['name'])

              @entry = Entry.find_or_create_by(
                day_period: @day_period,
                emotion: @emotion,
                user: @current_user
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
    @day = Day.find_by(id: params[:id], user: @current_user)
  end

  # Only allow a list of trusted parameters through.
  def day_params
    params.require(:day).permit(:date, periods_attributes: [:name, emotions_attributes: [:name]])
  end

  # Set the `@current_user` instance variable using Doorkeeper.
  def set_current_user
    return unless doorkeeper_token

    @current_user = User.find_by(id: doorkeeper_token.resource_owner_id)
  end
end