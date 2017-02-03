#!/bin/bash
# source_environment.sh
# Given an environment, extract all prefixed environment variables and add them to the current
# context un-prefixed.
# For example: STAGING_VARIABLE="foo bar" -> VARIABLE="foo bar"
environment=$1

for i in $(env); do
  if [[ "$i" =~ ^$environment\_ ]]; then
    export $(echo $i | sed "s/^$environment\_//g")
  fi
done


# echo all environment vars
echo "All environment variables:"
env
