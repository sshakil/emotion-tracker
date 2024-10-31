# # Seed Periods
# [
#   { name: 'Early Morning' },
#   { name: 'Morning' },
#   { name: 'Afternoon' },
#   { name: 'Evening' },
#   { name: 'Before Bed' }
# ].each do |period_attributes|
#   Period.find_or_create_by(period_attributes)
# end
#
# # Seed Emotions
# [
#   { name: 'Happy' },
#   { name: 'Angry' },
#   { name: 'Sad' },
#   { name: 'Fearful' }
# ].each do |emotion_attributes|
#   Emotion.find_or_create_by(emotion_attributes)
# end
#
# # Seed Days
# [
#   { date: Date.today },
#   { date: Date.yesterday }
# ].each do |day_attributes|
#   Day.find_or_create_by(day_attributes)
# end
#
# # Seed DayPeriods
# Day.all.each do |day|
#   Period.all.each do |period|
#     DayPeriod.find_or_create_by(day: day, period: period)
#   end
# end
#
# # Seed Entries
# DayPeriod.all.each do |day_period|
#   Emotion.all.each do |emotion|
#     Entry.find_or_create_by(day_period: day_period, emotion: emotion)
#   end
# end