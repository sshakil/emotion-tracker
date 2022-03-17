class CreatePeriods < ActiveRecord::Migration[7.0]
  def change
    create_table :periods do |t|
      t.date :date
      t.string :period

      t.timestamps
    end
  end
end
