class PeriodsController < ApplicationController
  before_action :set_period, only: %i[ show edit update destroy ]
  skip_before_action :verify_authenticity_token

  # GET /periods or /periods.json
  def index
    @periods = Period.all
  end

  # GET /periods/1 or /periods/1.json
  def show
    # @period = Period.find(params["id"])
    # Period.includes(:emotions)
    # @period = Period.find_with_emotions(params["id"])
    # puts @period.attributes
    #
    render json: @period

  end

  # GET /periods/new
  def new
    @period = Period.new
  end

  # GET /periods/1/edit
  def edit
  end

  # POST /periods or /periods.json
  def create
    @period = Period.new(period_params)

    respond_to do |format|
      if @period.save
        format.json { render :show, status: :created, location: @period }
      else
        format.json { render json: @period.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /periods/1 or /periods/1.json
  def update
    respond_to do |format|
      if @period.update(period_params)
        format.json { render :show, status: :ok, location: @period }
      else
        format.json { render json: @period.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /periods/1 or /periods/1.json
  def destroy
    @period.destroy

    respond_to do |format|
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_period
      @period = Period.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def period_params
      params.require(:period).permit(:date, :period, emotions_attributes: [:id, :name])
    end
end
