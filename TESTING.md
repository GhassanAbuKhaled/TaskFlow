# Testing Guide

## Overview
This project uses a comprehensive testing strategy with multiple types of tests to ensure code quality and reliability.

## Test Types

### 1. Unit Tests
- **Location**: `src/__tests__/components/`, `src/__tests__/utils/`, `src/__tests__/hooks/`
- **Purpose**: Test individual components and functions in isolation
- **Run**: `npm run test:run`

### 2. Integration Tests
- **Location**: `src/__tests__/integration/`
- **Purpose**: Test complete workflows and component interactions
- **Run**: `npm run test:run -- src/__tests__/integration/`

### 3. Performance Tests
- **Location**: `src/__tests__/performance/`
- **Purpose**: Measure render times and memory usage
- **Run**: `npm run test:run -- src/__tests__/performance/`

### 4. Accessibility Tests
- **Location**: `src/__tests__/a11y/`
- **Purpose**: Ensure components meet accessibility standards
- **Run**: `npm run test:run -- src/__tests__/a11y/`

## Commands

```bash
# Run all tests
npm run test:run

# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run specific test types
npm run test:run -- src/__tests__/integration/
npm run test:run -- src/__tests__/performance/
npm run test:run -- src/__tests__/a11y/
```

## CI/CD Integration

### Automated Testing
- Tests run automatically on every push to `main` and `develop` branches
- Tests run on all pull requests
- Deployment is blocked if tests fail

### Workflows
- **test.yml**: Runs all test suites on push/PR
- **deploy.yml**: Runs tests before deployment to production

## Test Coverage
- Target: 80%+ code coverage
- Reports generated in `coverage/` directory
- Coverage uploaded to Codecov (if configured)

## Best Practices
1. Write tests for all new features
2. Update tests when modifying existing code
3. Use descriptive test names
4. Mock external dependencies
5. Test both happy path and error cases