class Entry < ApplicationRecord
  belongs_to :day_period
  belongs_to :emotion

  before_create :set_uuid

  private

  def set_uuid
    # TODO: this appears to leave possibility of attempting to save a non-unique value which the DB would reject
    # had to go down this path of using string type due to SQLite not having UUID type
    self.uuid = SecureRandom.uuid if self.uuid.blank?
  end
end
