class Day < ApplicationRecord
  has_many :day_periods
  has_many :periods, through: :day_periods
  # has_many :entries
  # has_many :emotions, through: :entries
end
