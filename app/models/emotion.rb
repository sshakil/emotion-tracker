class Emotion < ApplicationRecord
  include Virtus.model

  has_many :entries
  has_many :periods, through: :entries

  attribute :name, String
end
