# PR Description Update Instructions

## Adding Policy Confirmation to PR Description

To complete task T002, the content from `PR-DESCRIPTION-UPDATE.md` needs to be added to the PR description. Since we're operating in a command-line environment without direct GitHub access, here are the instructions for manually updating the PR:

### Option 1: GitHub Web UI
1. Go to the PR for branch `test/test-001-core-ui-atoms` in the GitHub repository
2. Click "Edit" on the PR description
3. Add the content from `PR-DESCRIPTION-UPDATE.md` to the PR description
4. Save the changes

### Option 2: GitHub CLI
If you have the GitHub CLI installed and authenticated, you can update the PR description with:

```bash
gh pr edit <PR-NUMBER> --body-file PR-DESCRIPTION-UPDATE.md
```

Replace `<PR-NUMBER>` with the actual PR number.

## Verification
After updating the PR description, verify that:
1. The statement about the internal mocking policy audit is clearly visible in the PR description
2. The statement accurately reflects the findings from the T001 audit
3. The statement mentions all audited files and the search patterns used