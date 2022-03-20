class Period < ApplicationRecord
  include Virtus.model

  has_many :entries
  has_many :emotions, through: :entries

  # accepts_nested_attributes_for :emotions

  attribute :emotions, Array[Emotion]
end
