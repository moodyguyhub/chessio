# Chessio Testing Documentation

## Testing Strategy

Chessio implements a comprehensive 4-tier testing approach:

1. **Sanity Checks** - Fast pre-deployment validation
2. **Unit Tests** - Individual function/module testing
3. **Integration Tests** - Component interaction testing
4. **E2E/Smoke Tests** - Full user flow testing

## Quick Start

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:e2e           # End-to-end tests
npm run test:sanity        # Quick sanity check

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Test Suites

### 1. Sanity Checks (`tests/sanity-check.ts`)
**Purpose:** Quick validation before deployment (< 5 seconds)
**When:** Before every git push, build, and deployment

**Coverage:**
- Chess logic (FEN parsing, move validation)
- XP calculations
- Brand color specifications
- Critical constants

**Run:** `npm run test:sanity`

### 2. Unit Tests (`src/__tests__/unit/`)
**Purpose:** Test individual functions in isolation
**When:** During development, pre-commit hook

**Coverage:**
- `chess.test.ts` - Chess logic (parseFen, validateMove, isCheckmate)
- `gamification.test.ts` - XP system (calculateXpForLesson, getLevelFromXp)
- `api-errors.test.ts` - Error handling utilities
- `lessons.test.ts` - Lesson data processing

**Run:** `npm run test:unit`

### 3. Integration Tests (`src/__tests__/integration/`)
**Purpose:** Test component interactions and React rendering
**When:** Before merging PRs

**Coverage:**
- `chessboard.test.tsx` - Chessboard component rendering and interactions
- `lesson-player.test.tsx` - Lesson engine flow (task progression, hints, completion)
- `auth-flow.test.tsx` - Authentication components
- `dashboard.test.tsx` - Dashboard with real data

**Run:** `npm run test:integration`

### 4. E2E Tests (`tests/e2e/`)
**Purpose:** Test complete user flows in real browser
**When:** Before staging/production deployment

**Coverage:**
- `smoke.spec.ts` - Critical path smoke tests (page loads, navigation, performance)
- `auth.spec.ts` - Registration, login, logout flows
- `lesson-flow.spec.ts` - Complete lesson playthrough
- `progress.spec.ts` - XP earning, level up, streak tracking

**Run:** `npm run test:e2e`

## Coverage Requirements

- **Minimum:** 70% overall coverage
- **Critical paths:** 90%+ coverage
- **Core logic:** 100% coverage (chess.ts, gamification/xp.ts)

## Test Data

### Seeded Test User
```
Email: test@chessio.app
Password: password123
```

### Mock Lessons
Test lessons are created in `__mocks__/lessons.ts` with known outcomes.

## CI/CD Integration

Tests run automatically in this order:

1. **Pre-commit:** `test:sanity` (< 5s)
2. **Pre-push:** `test:unit` (< 30s)
3. **PR:** `test:integration` + `test:unit` (< 2min)
4. **Pre-deploy:** All tests including E2E (< 5min)

## Writing Tests

### Unit Test Example
```typescript
describe('calculateXpForLesson', () => {
  it('should award base XP for lesson completion', () => {
    const xp = calculateXpForLesson({
      lessonCompleted: true,
      hintsUsed: 0,
      attempts: 1,
    });
    
    expect(xp).toBeGreaterThan(0);
  });
});
```

### Integration Test Example
```typescript
describe('Chessboard Component', () => {
  it('should render 64 squares', () => {
    const { container } = render(
      <Chessboard fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" />
    );
    
    const squares = container.querySelectorAll('[data-square]');
    expect(squares).toHaveLength(64);
  });
});
```

### E2E Test Example
```typescript
test('landing page loads successfully', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Chessio/);
  await expect(page.getByText(/Learn chess calmly/i)).toBeVisible();
});
```

## Debugging Tests

```bash
# Run single test file
npm test chess.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="rook"

# Run with debugging
node --inspect-brk node_modules/.bin/jest --runInBand

# Playwright debug mode
npx playwright test --debug
```

## Performance Benchmarks

- Landing page load: < 3s
- Chessboard render: < 100ms
- Move validation: < 10ms
- Lesson task transition: < 500ms

## Accessibility Testing

E2E tests include basic a11y checks:
- Keyboard navigation
- Screen reader compatibility (via aria-labels)
- Focus management
- Color contrast (Ink & Ivory palette compliant)

## Known Limitations

1. E2E tests require database connection
2. Some tests need real browser (Playwright installs Chromium)
3. Auth tests may fail if session handling changes
4. Move validation tests assume chess.js behavior

## Maintenance

- Update test data when lessons change
- Re-record E2E traces when UI changes significantly
- Keep mock data in sync with Prisma schema
- Review coverage reports monthly
