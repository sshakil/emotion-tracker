require "application_system_test_case"

class DayPeriodsTest < ApplicationSystemTestCase
  setup do
    @day_period = day_periods(:one)
  end

  test "visiting the index" do
    visit day_periods_url
    assert_selector "h1", text: "Day periods"
  end

  test "should create day period" do
    visit day_periods_url
    click_on "New day period"

    fill_in "Day", with: @day_period.day_id
    fill_in "Period", with: @day_period.period_id
    click_on "Create Day period"

    assert_text "Day period was successfully created"
    click_on "Back"
  end

  test "should update Day period" do
    visit day_period_url(@day_period)
    click_on "Edit this day period", match: :first

    fill_in "Day", with: @day_period.day_id
    fill_in "Period", with: @day_period.period_id
    click_on "Update Day period"

    assert_text "Day period was successfully updated"
    click_on "Back"
  end

  test "should destroy Day period" do
    visit day_period_url(@day_period)
    click_on "Destroy this day period", match: :first

    assert_text "Day period was successfully destroyed"
  end
end
