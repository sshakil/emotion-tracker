class DaysController < ApplicationController
  before_action :set_day, only: %i[ edit update destroy ]
  skip_before_action :verify_authenticity_token

  # GET /days or /days.json
  def index
    @days = Day.all
  end

  # GET /days/1 or /days/1.json
  def show
    @day = Day.find_by(date: params['date'])

    # see https://stackoverflow.com/questions/22997327/should-i-return-null-an-empty-object-or-an-empty-array-for-json-with-no-data
    day_json = {}

    unless @day.nil?
      day_json =
        {
          date: @day.date.iso8601,
          periods: @day.day_periods.collect do |day_period|
            {
              name: day_period.period.name,
              emotions: day_period.emotions.all.as_json(except: :id)
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
    begin
      @day = Day.find_or_create_by(date: params['date'])
      @period = Period.find_by(name: params['period'])
      @emotion = Emotion.find_or_create_by(name: params['emotion'])
      

      if !@day.nil? && !@period.nil? && !@emotion.nil?
        @day_period = DayPeriod.create(
          day: @day,
          period: @period
        )
        @entry = Entry.create(
          day_period: @day_period,
          emotion: @emotion
        )
      end
      # render status: :no_content
      # render render :show
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
