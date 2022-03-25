class Period < ApplicationRecord
  has_many :entries
  has_many :emotions, through: :entries
  belongs_to :day

  accepts_nested_attributes_for :emotions

  scope :find_with_emotions, -> (id) do
    Period.eager_load(:emotions).find(id)
  end

  include ActiveModel::Serializers::JSON

  def attributes
    hash = super
    hash.merge!(:emotions => self.emotions)
  end

end
