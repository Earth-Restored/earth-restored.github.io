REPO_DIR="${1:-.}"
cd "$REPO_DIR" || { echo "Repo path not found: $REPO_DIR"; exit 1; }

git pull

CHANGED_FILES=$(git status --porcelain | awk '{print $2}' | tr '\n' ', ' | sed 's/, $//')

if [ -z "$CHANGED_FILES" ]; then
  echo "No changes to commit."
  exit 0
fi

git add -A
git commit -m "Updated files: $CHANGED_FILES"
git push

echo "Synced and committed: $CHANGED_FILES"
