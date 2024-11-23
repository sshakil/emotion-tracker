class Day < ApplicationRecord
  belongs_to :user

  has_many :day_periods
  has_many :periods, through: :day_periods
  has_many :entries, through: :day_periods
  has_many :emotions, through: :entries

  validates :user, presence: true
end
