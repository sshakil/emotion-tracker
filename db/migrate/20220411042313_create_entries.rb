class CreateEntries < ActiveRecord::Migration[7.0]
  def change
    create_table :entries do |t|
      t.references :day_period, null: false, foreign_key: true
      t.references :emotion, null: false, foreign_key: true
    end
  end
end
