@javascript
Feature: Automated Daily Email Notifications
  As a user of the EmotionTracker application
  I want to receive daily email notifications automatically
  So that I can log my emotions

  Scenario: Sending daily emails to all users
    Given There are registered users
    When The system initializes
    Then The daily notification job should be scheduled
    And All users should be notified