class RemovePeriodIdFromEntriesAndEntryIdFromEmotions < ActiveRecord::Migration[6.1]
  def change
    remove_column :entries, :period_id, :integer
    remove_column :emotions, :entry_id, :integer
  end
end