 # XIVAPI Findings
 ## Action Filtering
 ### IsPlayerAction

 `IsPlayerAction` does not appear to reliably distinguish abilities usable by the player.

 Examples:
| Action | IsPlayerAction |
|---|---|
| Drakesbane | true |
| Vercure | true |
| Addle | true |
| Primal Ruination | false |
| Tendo Setsugekka | false |

Because some known player actions return false, `IsPlayerAction` should not be used to identify player abilities as a filter.

### ClassJobCategory

Initial Testing suggests that `ClassJobCategory` may be useful in identifying player/job actions from enemy/internal actions.

Player/role actions tested had non-zero `ClassJobCategory` values
Known Player and Role Action `ClassJobCategory` Examples:
- Drakesbane: 23
- Primal Ruination: 22
- Tendo Setsugekka: 111
- Vercure: 112
- Addle: 116
- Feint: 114

Enemy/Internal actions had:
`ClassJobCategory = 0`
Known Enemy and Internal Action `ClassJobCategory` Examples:
- Tendon Ripper
- Majestic Meteor
- Idyllic Dream
- Vamp Stomp
- Sunrise Sabbath

### Current Hypothesis
`ClassJobCategory != 0` appears to be a method of excluding enemy/internal system actions.

This should be treated as an empirical finding rather than a guaranteed interpretation of the XIVAPI schema until more edge cases are tested.
