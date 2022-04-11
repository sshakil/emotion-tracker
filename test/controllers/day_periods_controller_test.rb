require "test_helper"

class DayPeriodsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @day_period = day_periods(:one)
  end

  test "should get index" do
    get day_periods_url
    assert_response :success
  end

  test "should get new" do
    get new_day_period_url
    assert_response :success
  end

  test "should create day_period" do
    assert_difference("DayPeriod.count") do
      post day_periods_url, params: { day_period: { day_id: @day_period.day_id, period_id: @day_period.period_id } }
    end

    assert_redirected_to day_period_url(DayPeriod.last)
  end

  test "should show day_period" do
    get day_period_url(@day_period)
    assert_response :success
  end

  test "should get edit" do
    get edit_day_period_url(@day_period)
    assert_response :success
  end

  test "should update day_period" do
    patch day_period_url(@day_period), params: { day_period: { day_id: @day_period.day_id, period_id: @day_period.period_id } }
    assert_redirected_to day_period_url(@day_period)
  end

  test "should destroy day_period" do
    assert_difference("DayPeriod.count", -1) do
      delete day_period_url(@day_period)
    end

    assert_redirected_to day_periods_url
  end
end
