class Period < ApplicationRecord
  has_many :day_periods
  has_many :days, through: :day_periods
end
