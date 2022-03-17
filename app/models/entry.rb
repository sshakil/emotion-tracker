class Entry < ApplicationRecord
  belongs_to :emotion
  belongs_to :period

  accepts_nested_attributes_for :emotion
end
