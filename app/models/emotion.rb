class Emotion < ApplicationRecord
  has_many :entries, dependent: :delete_all
  has_many :periods, through: :entries

  accepts_nested_attributes_for :periods
end
