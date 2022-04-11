require "application_system_test_case"

class EmotionsTest < ApplicationSystemTestCase
  setup do
    @emotion = emotions(:one)
  end

  test "visiting the index" do
    visit emotions_url
    assert_selector "h1", text: "Emotions"
  end

  test "should create emotion" do
    visit emotions_url
    click_on "New emotion"

    fill_in "Name", with: @emotion.name
    click_on "Create Emotion"

    assert_text "Emotion was successfully created"
    click_on "Back"
  end

  test "should update Emotion" do
    visit emotion_url(@emotion)
    click_on "Edit this emotion", match: :first

    fill_in "Name", with: @emotion.name
    click_on "Update Emotion"

    assert_text "Emotion was successfully updated"
    click_on "Back"
  end

  test "should destroy Emotion" do
    visit emotion_url(@emotion)
    click_on "Destroy this emotion", match: :first

    assert_text "Emotion was successfully destroyed"
  end
end
