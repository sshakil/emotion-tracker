class DayPeriod < ApplicationRecord
  belongs_to :day
  belongs_to :period

  has_many :entries
  has_many :emotions, through: :entries
end
