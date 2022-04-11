class CreateDayPeriods < ActiveRecord::Migration[7.0]
  def change
    create_table :day_periods do |t|
      t.references :day, null: false, foreign_key: true
      t.references :period, null: false, foreign_key: true
    end
  end
end
