// Console Documentation of tested results during api-findings.md

# Action Filtering Experimentation

## Test 1: Player Actions

| Action           |    ID | Player |   PvP |  Role | ClassJob | ClassJobCategory | Level |
| ---------------- | ----: | -----: | ----: | ----: | -------: | ---------------: | ----: |
| Primal Ruination | 36925 |  false | false | false |        0 |               22 |   100 |
| Tendo Setsugekka | 36966 |  false | false | false |        0 |              111 |   100 |
| Drakesbane       | 36952 |   true | false | false |        0 |               23 |    64 |
| Vercure          |  7514 |   true | false | false |       35 |              112 |    54 |

## Test 2: Enemy / Internal Actions
| Action          |    ID | Player |   PvP |  Role | ClassJob | ClassJobCategory | Level |
| --------------- | ----: | -----: | ----: | ----: | -------: | ---------------: | ----: |
| Majestic Meteor | 46057 |  false | false | false |       -1 |                0 |     0 |
| Idyllic Dream   | 46345 |  false | false | false |       -1 |                0 |     0 |
| Vamp Stomp      | 45898 |  false | false | false |       -1 |                0 |     0 |
| Sunrise Sabbath | 39610 |  false | false | false |       -1 |                0 |     0 |
| Tendon Ripper   | 47438 |  false | false | false |       -1 |                0 |     0 |

## Test 3: Check Player Role Actions
| Action       |   ID | Player |   PvP | Role | ClassJob | ClassJobCategory | Level |
| ------------ | ---: | -----: | ----: | ---: | -------: | ---------------: | ----: |
| Feint        | 7549 |   true | false | true |       -1 |              114 |    22 |
| Second Wind  | 7541 |   true | false | true |       -1 |              118 |     8 |
| Arm's Length | 7548 |   true | false | true |       -1 |              161 |    32 |
| True North   | 7546 |   true | false | true |       -1 |              114 |    50 |
| Bloodbath    | 7542 |   true | false | true |       -1 |              114 |    12 |

## Observations (as of Sept. 9th, 2026)
- `IsPlayerAction` does not reliably identify player-usable actions.
- Known job actions can have `IsPlayerAction = false`.
- Role actions have `IsRoleAction = true`.
- Known player and role actions tested have non-zero `ClassJobCategory`.
- Enemy/internal actions tested have `ClassJobCategory = 0`.
- Enemy/internal actions tested also have `Level = 0`.
- `ClassJob = -1` is not sufficient to identify non-player actions because role actions also use `ClassJob = -1`.

## Current Hypothesis (as of Sept. 9th, 2026)

`ClassJobCategory != 0` appears to be a useful filter for excluding
enemy/internal actions.

Additional testing is required before treating this as a definitive
interpretation of the API data.
