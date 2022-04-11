class Entry < ApplicationRecord
  belongs_to :day_period
  belongs_to :emotion
end
