import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintPluginImport from 'eslint-plugin-import';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
// import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      eslintConfigPrettier,
    ],
    plugins: {
      import: eslintPluginImport,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          distinctGroup: false,
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },

            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '**/*.+(css|sass|less|scss|pcss|styl)',
              patternOptions: {
                dot: true,
                nocomment: true,
              },
              group: 'unknown',
              position: 'after',
            },
            {
              pattern: '{.,..}/**/*.+(css|sass|less|scss|pcss|styl)',
              patternOptions: {
                dot: true,
                nocomment: true,
              },
              group: 'unknown',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          warnOnUnassignedImports: true,
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          groups: [
            ['builtin', 'external'],
            ['internal'],
            ['parent', 'sibling', 'index'],
            ['type', 'object', 'unknown'],
          ],
        },
      ],
    },
  },
]);
