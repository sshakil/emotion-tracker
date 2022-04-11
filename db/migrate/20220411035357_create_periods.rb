class CreatePeriods < ActiveRecord::Migration[7.0]
  def change
    create_table :periods do |t|
      t.string :name
    end
    add_index :periods, :name, unique: true
  end
end
