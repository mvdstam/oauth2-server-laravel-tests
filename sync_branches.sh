#!/usr/bin/env bash

# Sync the current branch to all *other* branches

currentBranch=$(git rev-parse --abbrev-ref HEAD)

git stash

for branch in `git branch --list|sed 's/\*//g'`; do
  if [[ "$branch" == "${currentBranch}" ]]; then
    continue
  fi

  git checkout $branch
  git merge $currentBranch --no-edit
  echo "Merged ${branch}"
done

git checkout $currentBranch;
git stash pop
