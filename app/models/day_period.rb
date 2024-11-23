class DayPeriod < ApplicationRecord
  belongs_to :day
  belongs_to :period
  belongs_to  :user

  has_many :entries
  has_many :emotions, through: :entries

  validates :user, presence: true

  def has_entries
    entries.exists?
  end
end
