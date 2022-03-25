class Day < ApplicationRecord
  has_many :periods
  accepts_nested_attributes_for :periods

  include ActiveModel::Serializers::JSON

  def attributes
    hash = super
    hash.merge!(:periods => self.periods)
  end
end
