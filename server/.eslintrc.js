module.exports = {
    env: {
        es6: true,
        node: true
    },
    extends: ['eslint:recommended', 'prettier'],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    rules: {
        indent: ['error', 4],
        'linebreak-style': 0,
        quotes: ['error', 'single'],
        semi: ['error', 'always']
    },
    plugins: [
        "prettier"
    ]
};
