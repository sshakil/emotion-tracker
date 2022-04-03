class EntriesController < ApplicationController
  before_action :set_entry, only: %i[ show edit update destroy ]

  # GET /entries or /entries.json
  def index
    @entries = Entry.all
  end

  # GET /entries/1 or /entries/1.json
  def show
  end

  # GET /entries/new
  def new
    @entry = Entry.new
  end

  # GET /entries/1/edit
  def edit
  end

  # POST /entries or /entries.json
  def create
    @entry = Entry.new(entry_params)

    respond_to do |format|
      if @entry.save
        format.json { render :show, status: :created, location: @entry }
      else
        format.json { render json: @entry.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /entries/1 or /entries/1.json
  def update
    respond_to do |format|
      if @entry.update(entry_params)
        format.json { render :show, status: :ok, location: @entry }
      else
        format.json { render json: @entry.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /entries/1 or /entries/1.json
  def destroy
    @entry.destroy

    respond_to do |format|
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_entry
      @entry = Entry.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def entry_params
      params.require(:entry).permit(:emotion_id, :period_id)
    end
end
