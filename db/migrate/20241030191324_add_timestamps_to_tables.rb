class AddTimestampsToTables < ActiveRecord::Migration[7.0]
  def change
    # Add timestamps to day_periods table
    add_timestamps :day_periods, null: true
    backfill_timestamps(DayPeriod)
    change_column_null :day_periods, :created_at, false
    change_column_null :day_periods, :updated_at, false

    # Add timestamps to days table
    add_timestamps :days, null: true
    backfill_timestamps(Day)
    change_column_null :days, :created_at, false
    change_column_null :days, :updated_at, false

    # Add timestamps to emotions table
    add_timestamps :emotions, null: true
    backfill_timestamps(Emotion)
    change_column_null :emotions, :created_at, false
    change_column_null :emotions, :updated_at, false

    # Add timestamps to entries table
    add_timestamps :entries, null: true
    backfill_timestamps(Entry)
    change_column_null :entries, :created_at, false
    change_column_null :entries, :updated_at, false

    # Add timestamps to periods table
    add_timestamps :periods, null: true
    backfill_timestamps(Period)
    change_column_null :periods, :created_at, false
    change_column_null :periods, :updated_at, false
  end

  private

  def backfill_timestamps(model)
    model.find_in_batches do |batch|
      model.where(id: batch.map(&:id)).update_all(created_at: Time.current, updated_at: Time.current)
    end
  end
end
