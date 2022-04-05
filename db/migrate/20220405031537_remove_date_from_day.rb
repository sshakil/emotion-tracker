class RemoveDateFromDay < ActiveRecord::Migration[7.0]
  def change
    remove_column :days, :date, :date
  end
end
