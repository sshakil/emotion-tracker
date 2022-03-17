class Emotion < ApplicationRecord
  has_many :entries
  has_many :periods, through: :entries

  accepts_nested_attributes_for :periods
end
