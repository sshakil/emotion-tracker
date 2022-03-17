class Period < ApplicationRecord
  has_many :entries
  has_many :emotions, through: :entries

  accepts_nested_attributes_for :emotions

  def initialize(params)
    super(params)
  end

end
