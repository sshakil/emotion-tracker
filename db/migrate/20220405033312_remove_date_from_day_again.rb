class RemoveDateFromDayAgain < ActiveRecord::Migration[7.0]
  def change
    remove_column :days, :date, :datetime
  end
end
