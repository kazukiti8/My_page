const globals = require('globals');
const js = require('@eslint/js');

module.exports = [
  {
    ignores: ['node_modules/', 'logs/', 'pids/', 'css/tailwind.min.css', '*.config.js'],
  },
  js.configs.recommended,
  {
    // Global rules applying to all files
    rules: {
      'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }],
      'no-console': 'warn',
    },
  },
  {
    // Config for JS files in the root (Node.js environment)
    files: ['server.js', 'security-check.js', 'test-*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    // Config for JS files in the js/ directory (Browser/Module environment)
    files: ['js/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    // Config for UMD files like personal-config.js
    files: ['personal-config.js'],
    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        }
    }
  },
  {
    // Config for Service Worker
    files: ['sw.js'],
    languageOptions: {
        globals: {
            ...globals.serviceworker
        }
    }
  }
];
