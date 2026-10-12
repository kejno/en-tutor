import parser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['src/**/*.ts', 'test/**/*.ts', 'e2e/**/*.ts', '*.ts'],
    languageOptions: { parser },
    rules: {
      'no-console': 'error',
      'no-undef': 'off',
    },
  },
];
