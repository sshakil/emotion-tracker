class AddDayIdToPeriods < ActiveRecord::Migration[7.0]
  def change
    add_column :periods, :day_id, :integer
    add_index :periods, :day_id
  end
end
