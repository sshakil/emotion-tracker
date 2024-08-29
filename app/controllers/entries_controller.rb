class EntriesController < ApplicationController
  before_action -> { doorkeeper_authorize! :read, :write, :public }

  before_action :set_entry, only: %i[ destroy ]

  # DELETE /entries/1 or /entries/1.json
  def destroy
    if @entry
      @entry.destroy
      respond_to do |format|
        # Respond with a 204 No Content status on success
        format.json { head :no_content }
      end
    else
      respond_to do |format|
        format.json { render json: { error: "Entry not found" }, status: :not_found }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_entry
      @entry = Entry.find_by(uuid: params[:id])
    end

    # Only allow a list of trusted parameters through.
    def entry_params
      params.require(:entry).permit(:day_period_id, :emotion_id, :id)
    end
end
