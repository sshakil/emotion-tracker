@javascript # needed to allow multi-process/thread access to db
Feature: User Login
  I am a user
  I want to log in to the application
  So that I can access my Emotion Tracker dashboard

  Background:
    Given I am a user

  Scenario: Valid login
    When I log in with valid credentials
    Then I should see the dashboard

  Scenario: Invalid login
    When I log in with an invalid password
    Then I should remain on the login page with an error