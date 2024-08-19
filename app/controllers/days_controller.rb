class DaysController < ApplicationController
  before_action :set_day, only: %i[ edit update destroy ]
  skip_before_action :verify_authenticity_token

  # GET /days or /days.json
  def index
    @days = Day.all
  end

  # GET /days/1 or /days/1.json
  # day_json = {} because: see https://stackoverflow.com/questions/22997327/should-i-return-null-an-empty-object-or-an-empty-array-for-json-with-no-data
  # to handle front sending format mm/dd/yyyy
  # needed format: yyyy-mm-dd
  # date = Time.strptime(params['date'], "%m/%d/%Y ")
  def show
    @day = Day.find_by(date: params['date'])
    day_json = {}

    unless @day.nil?
      # Perform a single query to fetch all necessary data
      data = DayPeriod
               .joins(entries: :emotion)
               .select('day_periods.id as dp_id, periods.name as period_name, entries.uuid as entry_uuid, emotions.name as emotion_name')
               .joins(:period)
               .where(day_id: @day.id)

      # Manually group the data in memory
      periods_json = data.group_by(&:dp_id).map do |dp_id, records|
        {
          name: records.first.period_name,
          emotions: records.map { |record| { name: record.emotion_name, uuid: record.entry_uuid } }
        }
      end

      day_json = {
        date: @day.date.iso8601,
        periods: periods_json
      }
    end

    render json: day_json
  end
  # GET /days/new
  def new
    @day = Day.new
  end

  # GET /days/1/edit
  def edit
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

  # PATCH/PUT /days/1 or /days/1.json
  def update
    respond_to do |format|
      if @day.update(day_params)
        format.html { redirect_to day_url(@day), notice: "Day was successfully updated." }
        format.json { render :show, status: :ok, location: @day }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @day.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /days/1 or /days/1.json
  def destroy
    @day.destroy

    respond_to do |format|
      format.html { redirect_to days_url, notice: "Day was successfully destroyed." }
      format.json { head :no_content }
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
