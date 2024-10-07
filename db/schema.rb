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

ActiveRecord::Schema[7.0].define(version: 2024_10_07_053459) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "databasechangelog", id: false, force: :cascade do |t|
    t.string "id", limit: 255, null: false
    t.string "author", limit: 255, null: false
    t.string "filename", limit: 255, null: false
    t.datetime "dateexecuted", precision: nil, null: false
    t.integer "orderexecuted", null: false
    t.string "exectype", limit: 10, null: false
    t.string "md5sum", limit: 35
    t.string "description", limit: 255
    t.string "comments", limit: 255
    t.string "tag", limit: 255
    t.string "liquibase", limit: 20
    t.string "contexts", limit: 255
    t.string "labels", limit: 255
    t.string "deployment_id", limit: 10
  end

  create_table "databasechangeloglock", id: :integer, default: nil, force: :cascade do |t|
    t.boolean "locked", null: false
    t.datetime "lockgranted", precision: nil
    t.string "lockedby", limit: 255
  end

  create_table "day_periods", force: :cascade do |t|
    t.bigint "day_id", null: false
    t.bigint "period_id", null: false
    t.bigint "user_id", default: 1, null: false
    t.index ["day_id"], name: "index_day_periods_on_day_id"
    t.index ["period_id"], name: "index_day_periods_on_period_id"
    t.index ["user_id"], name: "index_day_periods_on_user_id"
  end

  create_table "days", force: :cascade do |t|
    t.date "date"
    t.bigint "user_id", default: 1, null: false
    t.index ["date"], name: "index_days_on_date", unique: true
    t.index ["user_id"], name: "index_days_on_user_id"
  end

  create_table "emotions", force: :cascade do |t|
    t.string "name", limit: 255
    t.index ["name"], name: "index_emotions_on_name", unique: true
  end

  create_table "entries", force: :cascade do |t|
    t.bigint "day_period_id", null: false
    t.bigint "emotion_id", null: false
    t.string "uuid", null: false
    t.bigint "user_id", default: 1, null: false
    t.index ["day_period_id"], name: "index_entries_on_day_period_id"
    t.index ["emotion_id"], name: "index_entries_on_emotion_id"
    t.index ["user_id"], name: "index_entries_on_user_id"
    t.index ["uuid"], name: "index_entries_on_uuid", unique: true
  end

  create_table "oauth_access_grants", force: :cascade do |t|
    t.bigint "resource_owner_id", null: false
    t.bigint "application_id", null: false
    t.string "token", null: false
    t.integer "expires_in", null: false
    t.text "redirect_uri", null: false
    t.string "scopes", default: "", null: false
    t.datetime "created_at", null: false
    t.datetime "revoked_at"
    t.index ["application_id"], name: "index_oauth_access_grants_on_application_id"
    t.index ["resource_owner_id"], name: "index_oauth_access_grants_on_resource_owner_id"
    t.index ["token"], name: "index_oauth_access_grants_on_token", unique: true
  end

  create_table "oauth_access_tokens", force: :cascade do |t|
    t.bigint "resource_owner_id"
    t.bigint "application_id", null: false
    t.string "token", null: false
    t.string "refresh_token"
    t.integer "expires_in"
    t.string "scopes"
    t.datetime "created_at", null: false
    t.datetime "revoked_at"
    t.string "previous_refresh_token", default: "", null: false
    t.index ["application_id"], name: "index_oauth_access_tokens_on_application_id"
    t.index ["refresh_token"], name: "index_oauth_access_tokens_on_refresh_token", unique: true
    t.index ["resource_owner_id"], name: "index_oauth_access_tokens_on_resource_owner_id"
    t.index ["token"], name: "index_oauth_access_tokens_on_token", unique: true
  end

  create_table "oauth_applications", force: :cascade do |t|
    t.string "name", null: false
    t.string "uid", null: false
    t.string "secret", null: false
    t.text "redirect_uri", null: false
    t.string "scopes", default: "", null: false
    t.boolean "confidential", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["uid"], name: "index_oauth_applications_on_uid", unique: true
  end

  create_table "periods", force: :cascade do |t|
    t.string "name", limit: 255
    t.bigint "day_id"
    t.index ["name"], name: "index_periods_on_name", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email", limit: 255, default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "day_periods", "days"
  add_foreign_key "day_periods", "periods"
  add_foreign_key "day_periods", "users"
  add_foreign_key "days", "users"
  add_foreign_key "entries", "day_periods"
  add_foreign_key "entries", "emotions"
  add_foreign_key "entries", "users"
  add_foreign_key "oauth_access_grants", "oauth_applications", column: "application_id"
  add_foreign_key "oauth_access_tokens", "oauth_applications", column: "application_id"
  add_foreign_key "periods", "days", name: "fk8hf5gkjkg8y1ykf8c2jkgwha6"
end
