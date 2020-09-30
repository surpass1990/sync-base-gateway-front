const path = require('path');

export default {
    entry: 'src/index.js',
    extraBabelPlugins: [
        ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
    ],
    env: {
        development: {
            extraBabelPlugins: ['dva-hmr'],
        },
    },
    alias: {
        components: path.resolve(__dirname, 'src/components/'),
    },
    ignoreMomentLocale: true,
    theme: './src/theme.js',
    html: {
        template: './src/index.ejs',
    },
    disableDynamicImport: true,
    publicPath: '/',
    hash: true,

    proxy: {
        "/admin": {
            "target": "http://127.0.0.1:9999/",
            // "target": "http://ecc.test.jd.com:8125/",
            "changeOrigin": true,
            "pathRewrite": { "^/admin": "/admin" }
        }
    },
};
