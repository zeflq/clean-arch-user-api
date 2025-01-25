module.exports = {
    root: true,
    parser: '@typescript-eslint/parser', // Use TypeScript parser
    parserOptions: {
      project: ['./tsconfig.json'],
      sourceType: 'module',
      ecmaVersion: 2020,
    },
    env: {
      node: true,
      es2020: true,
    },
    plugins: [
      '@typescript-eslint',
      'import',
      'simple-import-sort',
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:import/recommended',
      'plugin:import/typescript',
      'prettier',
    ],
    rules: {
      'import/namespace': 'off',
      'import/no-unresolved': 'error',
      // ✅ Best Practices
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
  
      // ✅ TypeScript-Specific Rules
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
  
      // ✅ Import Rules
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            {
              pattern: '@core/**',
              group: 'internal',
            },
            {
              pattern: '@application/**',
              group: 'internal',
            },
            {
              pattern: '@infrastructure/**',
              group: 'internal',
            },
            {
              pattern: '@exposition/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true, // Always try to resolve `@types/*` packages
          project: './tsconfig.json', // Path to your tsconfig.json
        },
      },
    },
  };
  