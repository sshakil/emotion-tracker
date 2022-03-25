class RemoveDateFromPeriods < ActiveRecord::Migration[7.0]
  def change
    remove_column :periods, :date
  end
end
