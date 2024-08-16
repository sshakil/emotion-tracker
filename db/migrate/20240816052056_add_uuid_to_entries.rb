class AddUuidToEntries < ActiveRecord::Migration[6.1]
  def change
    # TODO switch out to UUID type for UUID column when using a different DB
    # had to go down this path of using string type due to SQLite not having UUID type
    add_column :entries, :uuid, :string, null: true
  end
end