class Period < ApplicationRecord
  has_many :entries
  has_many :emotions, through: :entries

  accepts_nested_attributes_for :emotions
  accepts_nested_attributes_for :entries

  def initialize(params)
    super(params)
  end

end
