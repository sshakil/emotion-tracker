class AddDateToDay < ActiveRecord::Migration[7.0]
  def change
    add_column :days, :date, :datetime
  end
end
