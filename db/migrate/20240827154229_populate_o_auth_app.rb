class PopulateOAuthApp < ActiveRecord::Migration[7.0]
  def change
    reversible do |dir|
      dir.up do
        Doorkeeper::Application.create!(
          name: 'Web',
          redirect_uri: 'http://localhost:3000/oauth/callback',
          scopes: 'read write public',
          confidential: false,
          )
      end
    end
  end
end