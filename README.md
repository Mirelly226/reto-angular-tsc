# RetoAngularTcs

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.19.

## Development server

To start a local development server, run:

```bash
npm start
```

The server will run on `http://localhost:4200/`. Make sure the backend API is running on `http://localhost:3002`.

## Building

To build the project for production:

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory.

## Running unit tests

This project uses [Jest](https://jestjs.io/) as the testing framework.

### Run tests once

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run tests with coverage

```bash
npm run test:coverage
```

This will generate a coverage report in the `coverage/` directory. The project maintains a minimum coverage threshold of 70% for branches, functions, lines, and statements.

Coverage reports are available in:
- HTML format: `coverage/lcov-report/index.html`
- LCOV format: `coverage/lcov.info`

## Implementation Notes

### Inconsistency Detected: Name Field Validation

**Issue found:**
- The challenge document specifies that the "Name" field must have a minimum of **5 characters**.
- However, the backend rejects values with 5 characters and requires a minimum of **6 characters**.

**Decision taken:**
The frontend validation was adjusted to **6 characters** to:
1. Avoid backend errors and improve user experience
2. Prevent users from completing the form correctly in the frontend but receiving an error when submitting
3. Maintain consistency between frontend and backend

**Location of changes:**
- `src/app/modules/products/components/product-form/product-form.component.ts` (line ~41)
- `src/app/modules/products/constants/form-errors.constants.ts` (line ~10)

This inconsistency can be mentioned during the technical interview to demonstrate analytical skills and pragmatic decision-making.
