import tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  { ignores: ['dist/**', 'node_modules/**', 'playwright-report/**'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { parser, parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module' } },
    plugins: { '@typescript-eslint': tseslint, 'react-hooks': reactHooks },
    rules: { ...tseslint.configs.recommended.rules, ...reactHooks.configs.recommended.rules, 'react-hooks/exhaustive-deps': 'warn' },
  },
];
