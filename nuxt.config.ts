// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },

    // Vite 冷启动会在 Nitro 写出 manifest 之前扫描 #app-manifest，导致 pre-transform 报错。
    // 首页 prerender 时，客户端切到 / 会在 beforeResolve 里先等 /_payload.json。
    // 首页没有需要水合的服务端数据，关掉 payload 提取后菜单可以立刻跳转。
    experimental: {
        appManifest: false,
        payloadExtraction: false,
    },

    routeRules: {
        // 首页已无 SSR 拉 GitHub：构建期预渲染成静态 HTML，由 Vercel CDN 直出。
        // 勿再用 swr：无状态函数的内存缓存不跨实例，冷启动仍会完整 SSR。
        '/': {
            prerender: true,
            headers: {
                'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
            },
        },
        '/tutorials/bosco-china-account-guide': {
            redirect: { to: '/tutorials/bosco-account-guide', statusCode: 301 },
        },
        '/tutorials/firstrade-china-account-guide': {
            redirect: { to: '/tutorials/firstrade-account-guide', statusCode: 301 },
        },
        '/tutorials/schwab-china-account-guide': {
            redirect: { to: '/tutorials/schwab-account-guide', statusCode: 301 },
        },
        '/tutorials/mainland-us-stock-invest-guide': {
            redirect: { to: '/tutorials/how-to-choose-us-broker', statusCode: 301 },
        },
        '/nav/deposit-withdraw': {
            redirect: { to: '/nav/fund-transfer', statusCode: 301 },
        },
        '/nav/digital-infra': {
            redirect: { to: 'https://zhenvia.com/digital-infra', statusCode: 301 },
        },
        // 方案 C：功能区 noindex；教程 / 信任页 / 首页默认可收录（见 utils/seo-index.ts）
        '/nav': { index: false },
        '/nav/**': { index: false },
        '/notes': { index: false },
        '/notes/**': { index: false },
        '/tools': { index: false },
        '/tools/**': { index: false },
        '/market': { index: false },
        '/market/**': { index: false },
        '/reports': { index: false },
        '/reports/**': { index: false },
        '/reviews': { index: false },
        '/reviews/**': { index: false },
        '/portfolio': { index: false },
        '/portfolio/**': { index: false },
    },

    modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],

    css: ['~/assets/css/main.css'],

    colorMode: {
        preference: 'light',
        fallback: 'light',
        hid: 'nuxt-color-mode-script',
        globalName: '__NUXT_COLOR_MODE__',
        classPrefix: '',
        classSuffix: '',
        storageKey: 'mysite-invest-color-mode-v2',
    },

    tailwindcss: {
        cssPath: '~/assets/css/main.css',
    },

    components: [
        {
            path: '~/components',
            pathPrefix: false,
        },
    ],

    app: {
        head: {
            htmlAttrs: {
                lang: 'zh-CN',
            },
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            link: [
                { rel: 'icon', type: 'image/png', href: '/logo.png' },
                { rel: 'apple-touch-icon', href: '/apple-touch-icon.svg' },
            ],
            meta: [
                { name: 'theme-color', content: '#F7F7F5' },
                { name: 'bytedance-verification-code', content: 'QAeqaVe2W59V7K40QM2u' },
                { name: 'shenma-site-verification', content: 'db59e3a5cae32a424959d2c3ef67e778_1790064802' },
            ],
        },
    },

    runtimeConfig: {
        githubToken: '',
        githubReportsOwner: 'zhenfeng95',
        githubReportsRepo: 'invest-agent',
        githubReportsPath: 'output/daily',
        githubMonthlyReviewsPath: 'output/reviews/monthly',
        githubWeeklyReviewsPath: 'output/reviews/weekly',
        githubReportsRef: 'main',
        githubTradesPath: 'data/raw/trades',
        /** 站内服务 API 根域名，可由 NUXT_API_BASE_URL 覆盖 */
        apiBaseUrl: 'https://api.zheninvest.com',
        /** 可选：整段覆盖日报前缀，默认 `${apiBaseUrl}/v1/reports` */
        reportsApiBase: '',
        /** 可选：覆盖首页摘要 URL，默认 `${reportsApiBase}/home` */
        reportsHomeUrl: '',
        indexnowKey: 'zheninvest-indexnow-8f3a2c1b',
        indexnowSyncSecret: '',
        public: {
            siteUrl: 'https://zheninvest.com',
            siteName: 'Zhen Invest',
        },
    },

    typescript: {
        strict: true,
    },

    vite: {
        optimizeDeps: {
            include: [
                'echarts/core',
                'echarts/charts',
                'echarts/components',
                'echarts/renderers',
            ],
        },
    },
});
