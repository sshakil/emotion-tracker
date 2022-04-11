class DayPeriodsController < ApplicationController
  before_action :set_day_period, only: %i[ show edit update destroy ]

  # GET /day_periods or /day_periods.json
  def index
    @day_periods = DayPeriod.all
  end

  # GET /day_periods/1 or /day_periods/1.json
  def show
  end

  # GET /day_periods/new
  def new
    @day_period = DayPeriod.new
  end

  # GET /day_periods/1/edit
  def edit
  end

  # POST /day_periods or /day_periods.json
  def create
    @day_period = DayPeriod.new(day_period_params)

    respond_to do |format|
      if @day_period.save
        format.html { redirect_to day_period_url(@day_period), notice: "Day period was successfully created." }
        format.json { render :show, status: :created, location: @day_period }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @day_period.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /day_periods/1 or /day_periods/1.json
  def update
    respond_to do |format|
      if @day_period.update(day_period_params)
        format.html { redirect_to day_period_url(@day_period), notice: "Day period was successfully updated." }
        format.json { render :show, status: :ok, location: @day_period }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @day_period.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /day_periods/1 or /day_periods/1.json
  def destroy
    @day_period.destroy

    respond_to do |format|
      format.html { redirect_to day_periods_url, notice: "Day period was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_day_period
      @day_period = DayPeriod.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def day_period_params
      params.require(:day_period).permit(:day_id, :period_id)
    end
end
