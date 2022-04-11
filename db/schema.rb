# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_04_11_042313) do
  create_table "day_periods", force: :cascade do |t|
    t.integer "day_id", null: false
    t.integer "period_id", null: false
    t.index ["day_id"], name: "index_day_periods_on_day_id"
    t.index ["period_id"], name: "index_day_periods_on_period_id"
  end

  create_table "days", force: :cascade do |t|
    t.date "date"
    t.index ["date"], name: "index_days_on_date", unique: true
  end

  create_table "emotions", force: :cascade do |t|
    t.string "name"
    t.index ["name"], name: "index_emotions_on_name", unique: true
  end

  create_table "entries", force: :cascade do |t|
    t.integer "day_period_id", null: false
    t.integer "emotion_id", null: false
    t.index ["day_period_id"], name: "index_entries_on_day_period_id"
    t.index ["emotion_id"], name: "index_entries_on_emotion_id"
  end

  create_table "periods", force: :cascade do |t|
    t.string "name"
    t.index ["name"], name: "index_periods_on_name", unique: true
  end

  add_foreign_key "day_periods", "days"
  add_foreign_key "day_periods", "periods"
  add_foreign_key "entries", "day_periods"
  add_foreign_key "entries", "emotions"
end
