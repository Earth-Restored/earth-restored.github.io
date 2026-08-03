#!/data/data/com.termux/files/usr/bin/bash

cd .. || exit 1

git add -A

CHANGED_FILES=$(git status --porcelain | awk '{print $2}' | tr '\n' ', ' | sed 's/, $//')

if [ -z "$CHANGED_FILES" ]; then
  exit 0
fi

git commit -m "Updated files: $CHANGED_FILES"
git pull --rebase
git push
