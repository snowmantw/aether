Feature: Arguments feature
  As a user of Aether, I want to look up if the arguments I set would be a part of configuration

  Scenario: List all presets
    Given Aether arguments `--help presets`
    When I execute Aether with it
    Then I should see "full"
    Then I should see "calendar/vanilla"
    Then I should see "built-in/media-apps"

  Scenario: Select one preset
    Given Aether arguments `-c calendar/vanilla -v`
    When I execute Aether with it
    Then I should see outputs include '"current":".*calendar/vanilla.json"'

  Scenario: Modules as arguments
    Given Aether arguments `-m ["system","gallery","video"] -v`
    When I execute Aether with it
    Then I should see outputs include '\["system","gallery","video"\]'

