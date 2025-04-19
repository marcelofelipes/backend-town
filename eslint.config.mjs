// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import * as eslinPluginImport from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'node_modules', 'dist', 'common/swagger.ts'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      'import': eslinPluginImport,
      'simple-import-sort': simpleImportSort,
    }
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.vitest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: {
          allowDefaultProject: ['vitest.config.mjs'],
        },
        tsconfigRootDir: import.meta.dirname
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // External packages starting with @nestjs
            ['^@nestjs'],
            // Other external packages
            ['^@?\\w'],
            // Internal packages starting with @services, @config etc
            ['^@services', '^@config', '^@utils'],
            // Parent imports starting with ..
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Same-folder imports starting with ./
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          ]
        }
      ],
      "simple-import-sort/exports": "error",
      'import/newline-after-import': 'error',
    },
  },
);