# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

Period.create([
                { name: 'Early Morning' },
                { name: 'Morning' },
                { name: 'Afternoon' },
                { name: 'Evening' },
                { name: 'Before Bed' }
              ])

Emotion.create([
                 { name: 'Happy' },
                 { name: 'Angry' },
                 { name: 'Sad' },
                 { name: 'Fearful' }
               ])

Day.create([
             { date: Date.today },
             { date: Date.yesterday }
           ])

Day.all.each do |day|
  Period.all.each do |period|
    DayPeriod.create([
                       { day: day, period: period }
                     ])
  end
end

arr = []

DayPeriod.all.collect do |day_period|
  Emotion.all.each do |emotion|
    arr << {
      day_period: day_period,
      emotion: emotion
    }
  end
end

Entry.create(arr)
