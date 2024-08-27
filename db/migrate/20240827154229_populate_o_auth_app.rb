class PopulateOAuthApp < ActiveRecord::Migration[7.0]
  def change
    reversible do |dir|
      dir.up do
        Doorkeeper::Application.create!(
          name: 'MyApp',
          redirect_uri: 'http://localhost:3000/oauth/callback',
          )
      end
    end
  end
end