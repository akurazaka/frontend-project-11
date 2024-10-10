import js from '@eslint/js';

export default [
  js.configs.recommended,

  {
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      quotes: ['error', 'single'],
      'no-trailing-spaces': ['error'],
      'comma-dangle': ['error', 'always-multiline'],
    },
  },
];
