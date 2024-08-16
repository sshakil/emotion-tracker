class DaysController < ApplicationController
  before_action :set_day, only: %i[ edit update destroy ]
  skip_before_action :verify_authenticity_token

  # GET /days or /days.json
  def index
    @days = Day.all
  end

  # GET /days/1 or /days/1.json
  def show
    # to handle front sending format mm/dd/yyyy
    # needed format: yyyy-mm-dd
    # date = Time.strptime(params['date'], "%m/%d/%Y ")

    @day = Day.includes(day_periods: :period).find_by(date: params['date'])

    # see https://stackoverflow.com/questions/22997327/should-i-return-null-an-empty-object-or-an-empty-array-for-json-with-no-data
    day_json = {}

    unless @day.nil?
      puts "------------------------date------------------------"
      puts "@day.date.to_date.to_s"
      puts @day.date.to_date.to_s
      puts "@day.date.iso8601"
      puts @day.date.iso8601

      day_json =
        {
          date: @day.date.iso8601,
          # date: @day.date.to_date.to_s,
          periods: @day.day_periods.collect do |day_period|
            {
              name: day_period.period.name,
              emotions: day_period.entries.includes(:emotion).map do |entry|
                entry.emotion.as_json(except: :id).merge(uuid: entry.uuid)
              end
            }
          end
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
            end
          end
        end
      end

      if errors.empty?
        render json: {}, status: :no_content
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
    # params.require(:day).permit(
    #   :date,
    #   periods_attributes: [
    #     :id,
    #     :name,
    #     emotions_attributes: [
    #       :id,
    #       :name
    #     ]
    #   ]
    # )
  end
end
