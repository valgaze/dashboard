# featureFlagEnable

This function, when passed the value of a feature flag that is a boolean, parses the value and
returns the type as a boolean.

For example, when `user.features.foo === 'TRUE'`, a call to `featureFlagEnabled(user.features.foo)`
would return the boolean `true`.
