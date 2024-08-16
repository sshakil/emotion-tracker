class PopulateUuidForEntries < ActiveRecord::Migration[6.1]
  def up
    Entry.find_each do |entry|
      entry.update_columns(uuid: SecureRandom.uuid)
    end
  end

  def down
    # Optionally clear out the UUIDs
    Entry.update_all(uuid: nil)
  end
end