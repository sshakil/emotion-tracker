class AddConstraintsToUuidInEntries < ActiveRecord::Migration[6.1]
  def change
    change_column_null :entries, :uuid, false
    add_index :entries, :uuid, unique: true
  end
end