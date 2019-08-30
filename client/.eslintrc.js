module.exports = {
    extends: [
        'standard',
        'plugin:react/recommended',
        'prettier/react',
        'prettier/standard',
    ],
    plugins: [
        'prettier',
        'react',
        'standard'
    ],
    env: {
        es6: true,
        browser: true,
        node: true,
    },
    rules : {
        indent: ['error', 4], // A custom style-related rule for example
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'react/prop-types': 0
        // More custom rules here
    },
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    globals: {
        localStorage: true,
        fetch: true
    },
    settings: {
        react: {
            version: 'detect'
        }
    }
};
