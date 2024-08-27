class PopulateAccessToken < ActiveRecord::Migration[7.0]
  def change
    reversible do |dir|
      dir.up do

        Doorkeeper::AccessToken.create!(
          resource_owner_id: User.first.id,
          application_id: Doorkeeper::Application.first.id,
          expires_in: 2.hours,
          scopes: 'public read write'
        )
      end
    end
  end
end
