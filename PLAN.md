# Implementation Plan: Mandatory Code Quality CI Gates (AUTO-003)

## Executive Summary

This plan implements a comprehensive CI quality gate system that enforces code quality standards through automated checks that must pass before code can be merged. The system consolidates existing fragmented workflows into a cohesive, philosophy-aligned approach.

## Philosophy Alignment Analysis

### Current State Assessment

- **Strengths**: Individual workflows exist for typecheck, test-coverage, and e2e
- **Gaps**: No consolidated quality gate, missing lint enforcement, inconsistent failure handling
- **Philosophy Violations**:
  - Automation principle violated (manual coordination of multiple workflows)
  - Quality gate principle violated (no unified pass/fail mechanism)
  - Explicit contracts violated (unclear CI success criteria)

### Target State

- Single consolidated quality gate workflow that enforces all standards
- Clear pass/fail criteria aligned with development philosophy
- Proper coverage thresholds matching component architecture (atoms/molecules/organisms)

## Technical Architecture

### 1. Workflow Consolidation Strategy

**Decision**: Replace fragmented workflows with single `quality-gate.yml` that orchestrates all checks
**Rationale**:

- Simplifies CI logic (Simplicity First principle)
- Creates explicit contract for "mergeable" code
- Enables proper dependency management between checks
- Aligns with "Automate Everything" principle

### 2. Quality Check Stages (Sequential)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Setup & Lint  │ -> │   Type & Test   │ -> │  Security & E2E │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Stage 1: Setup & Lint** (Fast Feedback)

- Environment setup (Node.js, pnpm, dependencies)
- Code formatting verification (Prettier)
- Linting (ESLint with TypeScript rules)
- **Fail Fast**: Stop pipeline if basic code quality fails

**Stage 2: Type & Test** (Core Quality)

- TypeScript type checking (strict mode)
- Unit tests execution
- Coverage analysis with component-specific thresholds
- **Fail Fast**: Stop if types fail or coverage insufficient

**Stage 3: Security & E2E** (Integration Quality)

- Dependency vulnerability scanning
- End-to-end tests (functional only in CI)
- **Final Gate**: All previous stages must pass

### 3. Coverage Threshold Architecture

**Philosophy-Aligned Approach**: Different thresholds for different architectural layers

```typescript
// Component-specific thresholds matching atomic design
coverageThreshold: {
  global: {
    statements: 85,
    branches: 80,
    functions: 85,
    lines: 85
  },
  // Atoms: Highest coverage (foundation components)
  'components/ui/**/*.{ts,tsx}': {
    statements: 95,
    branches: 90,
    functions: 95,
    lines: 95
  },
  // Molecules: High coverage (composite components)
  'components/molecules/**/*.{ts,tsx}': {
    statements: 90,
    branches: 85,
    functions: 90,
    lines: 90
  },
  // Organisms: Standard coverage (complex assemblies)
  'components/organisms/**/*.{ts,tsx}': {
    statements: 85,
    branches: 80,
    functions: 85,
    lines: 85
  },
  // Core utilities: Maximum coverage
  'lib/**/*.{ts,tsx}': {
    statements: 100,
    branches: 95,
    functions: 100,
    lines: 100
  }
}
```

## Implementation Steps

### Phase 1: Foundation Setup (Day 1, Morning)

#### 1.1 Create Quality Gate Workflow

```bash
# Create consolidated workflow
touch .github/workflows/quality-gate.yml
```

**Content**: Comprehensive workflow that:

- Runs on all PRs and pushes to main
- Implements sequential stages with proper error handling
- Uses matrix strategy for efficiency where appropriate
- Implements proper artifact collection and reporting

#### 1.2 Update Jest Configuration

```bash
# Backup current config
cp jest.config.js jest.config.js.backup
```

**Changes**:

- Implement component-specific coverage thresholds
- Add coverage reporting for CI consumption
- Configure Istanbul reporter for GitHub integration

#### 1.3 Add Dependency Security Scanning

```bash
# Add audit script to package.json
npm pkg set scripts.audit="pnpm audit --audit-level=high --prod"
```

**Integration**: Add to quality gate with proper failure handling

### Phase 2: Workflow Implementation (Day 1, Afternoon)

#### 2.1 Implement Core Quality Gate

**File**: `.github/workflows/quality-gate.yml`

**Architecture**:

```yaml
jobs:
  quality-gate:
    name: Quality Gate
    runs-on: ubuntu-latest
    steps:
      # Stage 1: Setup & Lint
      - name: Environment Setup
      - name: Install Dependencies
      - name: Code Formatting Check
      - name: ESLint Analysis

      # Stage 2: Type & Test
      - name: TypeScript Type Check
      - name: Unit Tests with Coverage
      - name: Coverage Threshold Validation

      # Stage 3: Security & Integration
      - name: Security Vulnerability Scan
      - name: E2E Tests (Functional)

      # Reporting
      - name: Coverage Report Generation
      - name: Artifact Collection
```

#### 2.2 Implement Branch Protection Rules

**Programmatic Setup**: Use GitHub API to configure branch protection

```bash
# Configure branch protection via gh CLI
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Quality Gate"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field restrictions=null
```

### Phase 3: Coverage Integration (Day 2, Morning)

#### 3.1 Integrate External Coverage Reporting

**Decision**: Use Codecov for visibility and trend analysis
**Implementation**:

```bash
# Add Codecov integration
npm install --save-dev @codecov/codecov-action
```

**Workflow Integration**:

- Upload coverage data to Codecov
- Configure PR comment integration
- Set up coverage differential analysis

#### 3.2 Configure Coverage Collection

**File**: `jest.config.js`

**Enhanced Configuration**:

```javascript
{
  coverageReporters: [
    'text',           // Console output
    'html',           // Local viewing
    'lcov',           // Codecov integration
    'json-summary',   // Programmatic access
    'github-actions'  // Native GitHub integration
  ],
  coverageDirectory: 'coverage',
  // Component-specific thresholds (detailed above)
}
```

### Phase 4: Security & E2E Integration (Day 2, Afternoon)

#### 4.1 Implement Security Scanning

**Philosophy Alignment**: "Security Considerations" + "Dependency Management"

```yaml
- name: Security Vulnerability Scan
  run: |
    echo "🔍 Scanning for vulnerabilities..."
    pnpm audit --audit-level=high --prod
    if [ $? -ne 0 ]; then
      echo "❌ High/Critical vulnerabilities found!"
      exit 1
    fi
    echo "✅ No high/critical vulnerabilities detected"
```

#### 4.2 Integrate E2E Testing

**Approach**: Reuse existing e2e infrastructure, optimize for CI

```yaml
- name: E2E Tests (Functional)
  run: |
    # Run only functional tests in CI (not visual)
    pnpm playwright test --grep-invert "@visual"
  env:
    NEXT_PUBLIC_FORMSPARK_FORM_ID: test-form-id
    CI: true
```

### Phase 5: Migration & Cleanup (Day 3)

#### 5.1 Workflow Migration Strategy

**Approach**: Blue-green deployment of CI workflows

1. **Deploy**: Add quality-gate.yml alongside existing workflows
2. **Test**: Verify quality-gate.yml works correctly
3. **Switch**: Update branch protection to use quality-gate
4. **Cleanup**: Remove redundant workflows

#### 5.2 Documentation Updates

**Files to Update**:

- `README.md`: Update CI status badges
- `CONTRIBUTING.md`: Document new quality requirements
- `CLAUDE.md`: Update CI commands

## Risk Assessment & Mitigation

### High Risk: CI Pipeline Failure Rate

**Risk**: New strict requirements cause excessive CI failures
**Probability**: Medium
**Impact**: High (blocks development)
**Mitigation**:

- Implement gradual rollout with temporary bypass mechanism
- Add detailed failure reporting and remediation guidance
- Monitor failure rates and adjust thresholds if needed

### Medium Risk: Coverage Threshold Compatibility

**Risk**: Existing codebase doesn't meet new coverage requirements
**Probability**: High
**Impact**: Medium (requires code changes)
**Mitigation**:

- Analyze current coverage before implementation
- Implement component-specific thresholds aligned with current state
- Plan incremental threshold increases

### Low Risk: Performance Impact

**Risk**: Consolidated workflow increases CI execution time
**Probability**: Low
**Impact**: Low (minor developer friction)
**Mitigation**:

- Use parallel job execution where possible
- Implement intelligent caching strategies
- Optimize test execution order (fail-fast approach)

## Testing Strategy

### Unit Testing Approach

**Focus**: Test the CI logic itself through sample PRs

- Create test branches with intentional violations
- Verify each quality gate stage fails appropriately
- Confirm proper error reporting and artifact collection

### Integration Testing

**Focus**: End-to-end CI pipeline validation

- Test complete PR workflow from creation to merge
- Verify branch protection integration
- Validate coverage reporting accuracy

### Rollback Strategy

**Immediate**: Keep existing workflows inactive but present
**Process**:

1. Disable quality-gate.yml
2. Re-enable previous workflows
3. Update branch protection rules
4. Communicate rollback to team

## Success Metrics

### Primary Metrics

- **Quality Gate Pass Rate**: Target >95% (after initial adjustment period)
- **Average CI Runtime**: Target <10 minutes for typical PR
- **Coverage Trend**: Gradual increase toward philosophy targets

### Secondary Metrics

- **Security Vulnerability Detection**: 100% high/critical caught
- **Developer Feedback**: Positive sentiment on CI reliability
- **Merge Conflict Reduction**: Improved due to stricter quality gates

## Open Questions & Decisions Needed

1. **Coverage Reporting Tool**: Codecov vs alternatives?

   - **Recommendation**: Codecov (industry standard, good GitHub integration)

2. **Visual Test Inclusion**: Include visual regression tests in quality gate?

   - **Recommendation**: No, keep separate due to flakiness and performance

3. **Security Scan Failure Policy**: Block vs warn on medium vulnerabilities?

   - **Recommendation**: Block on high/critical, warn on medium with tracking

4. **Rollout Timeline**: Immediate vs gradual rollout?
   - **Recommendation**: Immediate for new PRs, gradual for existing branches

## Completion Criteria

### Must Have (Minimum Viable Product)

- ✅ Quality gate workflow operational
- ✅ All four check types implemented (lint, type, test, security)
- ✅ Component-specific coverage thresholds enforced
- ✅ Branch protection configured
- ✅ Basic error reporting functional

### Should Have (Full Implementation)

- ✅ Coverage trend reporting (Codecov)
- ✅ Detailed failure analysis and reporting
- ✅ Performance optimization (parallel execution)
- ✅ Documentation updates complete

### Could Have (Future Enhancements)

- 📋 Advanced caching strategies
- 📋 Intelligent test selection based on change analysis
- 📋 Integration with external monitoring tools
- 📋 Automated threshold adjustment based on trends

## Implementation Timeline

**Day 1**: Foundation (Workflow creation, Jest config, basic implementation)
**Day 2**: Integration (Coverage reporting, security scanning, E2E integration)
**Day 3**: Migration (Rollout, cleanup, documentation)

**Total Effort**: 3 days (aligns with size:l label)
**Critical Path**: Jest configuration → Quality gate workflow → Branch protection
**Dependencies**: None blocking (TS-001, TEST-001, TEST-002 already complete)
