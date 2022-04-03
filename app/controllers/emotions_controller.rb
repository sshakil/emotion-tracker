class EmotionsController < ApplicationController
  before_action :set_emotion, only: %i[ show edit update destroy ]
  skip_before_action :verify_authenticity_token

  def new
    @emotion = Emotion.new
  end

  def create
    @emotion = Emotion.new(emotion_params)

    respond_to do |format|
      if @emotion.save
        format.json { render :show, status: :created, location: @emotion }
      else
        format.json { render json: @emotion.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @emotion.destroy

    respond_to do |format|
      format.json { head :no_content }
    end
  end


  private
  # Use callbacks to share common setup or constraints between actions.
  def set_emotion
    @emotion = Emotion.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def emotion_params
    params.require(:emotion).permit(:name)
  end
end