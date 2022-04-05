class AddDateToDayAgain < ActiveRecord::Migration[7.0]
  def change
    add_column :days, :date, :date
  end
end
