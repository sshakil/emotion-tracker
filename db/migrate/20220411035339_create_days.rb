class CreateDays < ActiveRecord::Migration[7.0]
  def change
    create_table :days do |t|
      t.date :date
    end
    add_index :days, :date, unique: true
  end
end
