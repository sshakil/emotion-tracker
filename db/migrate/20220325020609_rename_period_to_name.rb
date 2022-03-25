class RenamePeriodToName < ActiveRecord::Migration[7.0]
  def change
    rename_column :periods, :period, :name
  end
end
