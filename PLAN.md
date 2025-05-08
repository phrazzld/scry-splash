# Implementation Plan: SEC-001 - Remove Hardcoded Repository Configuration in CI

## Overview

This plan addresses the critical security issue (P0) of removing hardcoded repository configuration in CI workflows, specifically in `.github/workflows/chromatic.yml`.

- **Task ID**: SEC-001
- **Priority**: P0 (Critical)
- **Complexity**: Simple
- **Rationale**: Hardcoded values pose security risks and hinder CI portability.
- **Expected Outcome**: `.github/workflows/chromatic.yml` uses dynamic repository context; secrets handled securely.

## Current Issue

In `.github/workflows/chromatic.yml` (line 21), there is a hardcoded repository check:
```yaml
if: github.repository == 'your-organization/scry-splash'
```

This creates several problems:
1. It binds the CI configuration to a specific organization name
2. It reduces portability for forks and organization name changes
3. It exposes the expected repository structure publicly

## Implementation Plan

### 1. Fix the Hardcoded Repository Check

Replace the hardcoded repository check with a more portable approach using GitHub context variables:

```yaml
if: github.event.repository.owner.login == github.repository_owner
```

This ensures the workflow only runs for the repository owner, not for forks, without hardcoding a specific organization name. It uses GitHub's built-in context variables to dynamically check ownership.

### 2. Audit Other Workflows

Examine all GitHub Actions workflow files:
- `.github/workflows/typecheck.yml`
- Any other workflow files that might be added in the future

Ensure none of them contain hardcoded repository references.

### 3. Improve Secret Handling Documentation

Review and update documentation related to secrets, specifically:
1. Verify `CHROMATIC_PROJECT_TOKEN` is properly referenced in all workflows
2. Update relevant documentation files with secure handling practices

### 4. Testing Strategy

#### Pre-Deployment Testing
- Create a temporary branch with the change
- Push the branch to trigger the workflow and verify it executes correctly when run by the repository owner
- Create a test fork and verify the workflow is skipped when run from a fork

#### Post-Deployment Testing
- After merging to main, verify the workflow runs successfully  
- Have another team member fork the repository and confirm the workflow is properly skipped

#### Documentation Testing
- Verify all updated documentation is clear and accurate
- Have a team member follow the documentation to confirm it works as expected

### 5. Risk Assessment and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| New condition incorrectly blocks legitimate runs | High | Low | Test thoroughly before and after deployment with both the main repository and forks |
| New condition fails to block unauthorized runs | High | Low | Test with forks to verify the condition works as expected |
| GitHub context variables change in future GitHub Actions versions | Medium | Low | Monitor GitHub Actions release notes for context variable changes |
| Secret management improvements are insufficient | Medium | Low | Regular security audits of CI/CD processes |
| Documentation updates are unclear | Low | Medium | Have multiple team members review documentation changes |

## Implementation Steps

1. **Update CI Configuration**
   - Modify `.github/workflows/chromatic.yml` to use dynamic repository check
   - Verify syntax and logical correctness of condition

2. **Documentation Updates**
   - Update `docs/VISUAL_TESTING.md` (if exists) to include security considerations
   - Create or update security documentation with CI/CD best practices
   - Ensure `.env.local` is in `.gitignore` to prevent accidental secret exposure
   - Add guidance on secret rotation practices

3. **Testing and Validation**
   - Push changes to a feature branch to verify workflow functionality
   - Test fork behavior to ensure proper authorization controls
   - Review updated documentation for clarity and completeness

4. **Final Implementation**
   - Create PR for the changes
   - Address review feedback
   - Merge changes to main branch

## Completion Criteria

- ✅ `.github/workflows/chromatic.yml` no longer contains hardcoded repository names
- ✅ Workflow correctly allows execution on owner's repository and blocks on forks
- ✅ Documentation updated with secure practices for CI configuration and secrets
- ✅ All tests pass, verifying the functionality of the updated workflow
- ✅ PR reviewed and merged to main branch