# Investment Navigation / 投资导航

港美股与跨境出海一站式投资导航网站。

这个项目不是交易软件，也不是实时行情软件。部署目标是 Vercel，函数区域锁定在新加坡（sin1）。

## 在线体验

- 体验链接：https://zheninvest.com

## 技术栈

- Nuxt 3
- Vue 3
- TypeScript
- Nitro
- Tailwind CSS
- Vercel（区域 `sin1`，见 `vercel.json`）

## 目录结构

```text
.
├── assets/css/            # 全局样式
├── components/            # 布局、首页、教程、工具、导航组件
├── composables/           # SEO 等组合式函数
├── data/                  # JSON 数据，与 UI 解耦
│   ├── tutorials.json
│   ├── tools.json
│   └── navigation.json
├── layouts/
├── pages/
├── public/
├── server/api/            # Mock API 预留
├── types/
├── utils/                 # 数据读取层
├── nuxt.config.ts
├── vercel.json
└── README.md
```

## 常用命令

```bash
npm install
npm run dev
npm run build
```

## 安装

```bash
npm install
```

## 本地运行

```bash
cp .env.example .env
npm run dev
```

浏览器访问：

```text
http://localhost:3000
```

## Build

```bash
npm run build
```

构建产物在 `.output/`。推到 Vercel 后由平台执行 `nuxt build`，不需要在本机用 Wrangler 发布。

## 环境变量

复制 `.env.example` 为 `.env`。当前只有公开站点地址：

```bash
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

`nuxt.config.ts` 里的默认站点地址是 `https://zheninvest.com`。本地开发请在 `.env` 里改成 `http://localhost:3000`。该变量用于 canonical、Open Graph、sitemap 和 robots.txt。

### IndexNow

站点已接入 [IndexNow](https://www.indexnow.org/)（免费）。

从托管平台的共用出口代提交时，IndexNow 经常返回 **429**。推荐**在本机直接提交**：

1. 确认 key 可访问：`https://zheninvest.com/zheninvest-indexnow-8f3a2c1b.txt`
2. 先从站点取 payload（不真正提交）：

```bash
curl -X POST 'https://zheninvest.com/api/indexnow/sync?dryRun=1' -o /tmp/indexnow-payload.json
```

3. 用本机网络提交给必应：

```bash
jq '.payload' /tmp/indexnow-payload.json > /tmp/indexnow-body.json
curl -i -X POST 'https://www.bing.com/indexnow' \
  -H 'Content-Type: application/json; charset=utf-8' \
  -d @/tmp/indexnow-body.json
```

成功时 HTTP 状态一般为 `200` 或 `202`。也可只测首页：

```bash
curl -i 'https://www.bing.com/indexnow?url=https%3A%2F%2Fzheninvest.com%2F&key=zheninvest-indexnow-8f3a2c1b'
```

若设置了 `NUXT_INDEXNOW_SYNC_SECRET`，请求站点 sync 接口时需带请求头 `x-indexnow-secret`。

不要把 API Key、Token、Secret 或 Password 放进 Git。`.env` 已被忽略。

## Vercel 部署

`vercel.json` 把函数区域锁定为 `sin1`（新加坡），框架为 Nuxt。把这个仓库接到 Vercel 后，生产环境变量至少设置：

```bash
NUXT_PUBLIC_SITE_URL=https://zheninvest.com
NUXT_GITHUB_TOKEN=
```

仓库、日报目录和 `NUXT_API_BASE_URL` 已写在 `nuxt.config.ts` 的默认值里，需要改源时再用同名环境变量覆盖。`NUXT_GITHUB_TOKEN` 用 Vercel 的敏感环境变量，不要提交到 Git。

域名继续放在 Cloudflare，解析改为灰色云朵（仅 DNS）：根域名用 Vercel 给出的 A 记录或别名，`www` 用 CNAME 指向 `cname.vercel-dns.com`。不要打开橙色代理，也不要保留 Workers 上的自定义域名。

## 数据文件如何维护

第一阶段所有业务数据都在 `data/`：

- `data/tutorials.json`：教程
- `data/tools.json`：工具入口与状态
- `data/navigation.json`：导航分类和资源

页面不要直接写死业务数据。请通过 `utils/tutorials.ts`、`utils/tools.ts`、`utils/navigation.ts` 读取。

不确定的官方链接请保持 `officialUrlConfirmed: false`，不要伪造官网地址。

## 未来如何扩展

- 把 JSON 换成 Markdown / CMS / 数据库 / API 时，只改 `utils/` 数据层
- `server/api/` 已预留 `portfolio`、`calendar` 等
- 工具页目前是 Coming Soon，后续可在不改路由的前提下接入真实逻辑
- 不要在第一阶段加入用户系统、支付、实时行情或真实交易接口

## 收盘日报

投研 Agent 仓库里每个工作日生成的 Markdown 日报，可以通过 GitHub API 在本站 `/reports` 展示，无需把文件复制进这个仓库。

在 `.env` 中填写：

```bash
NUXT_GITHUB_REPORTS_OWNER=your-github-user
NUXT_GITHUB_REPORTS_REPO=your-agent-repo
NUXT_GITHUB_REPORTS_PATH=output/daily
NUXT_GITHUB_REPORTS_REF=main
NUXT_GITHUB_TOKEN=github_pat_xxx
```

`NUXT_GITHUB_REPORTS_PATH` 是日报 md 所在目录。文件名建议包含日期，例如 `2026-08-17.md`。私有仓库必须提供 Token；公开仓库也建议配置，以避免 GitHub API 限额。生产环境在 Vercel 项目里设置 `NUXT_GITHUB_TOKEN`，不要提交到 Git。

## 月度 / 每周复盘

复盘同样从 Agent 仓库读取，路径分开配置：

```bash
NUXT_GITHUB_MONTHLY_REVIEWS_PATH=output/reviews/monthly
NUXT_GITHUB_WEEKLY_REVIEWS_PATH=output/reviews/weekly
```

- 每月复盘：`/reviews/monthly`，文件示例 `monthly-2026-08.md`
- 每周复盘：`/reviews/weekly`，文件示例 `weekly-2026-09-1W.md`

## 财经日历

`/tools/calendar` 读取投研 Agent 仓库中的 `data/public/economic-calendar.json`，使用与日报相同的 GitHub 配置，不再依赖第三方日历 API Key。本地开发时也会尝试读取同级目录 `../invest-agent/data/public/economic-calendar.json`。

## 市场评分

`/market` 读取投研 Agent 仓库中的 `data/public/ashare-daily-snapshot.csv`，用 ECharts 柱状图展示每日市场评分。柱高为 `score`（0–100），柱颜色对应策略（防守 / 轻仓试错 / 积极参与 / 进攻）；`attack_ok` 为 true 的交易日在柱顶加菱形标记。悬停可看建议仓位、进攻四条件、账户重心等字段。本地开发时也会尝试读取同级目录 `../invest-agent/data/public/ashare-daily-snapshot.csv`。

## 主要路由

- `/`
- `/reports`
- `/reports/:date`
- `/reviews/monthly`
- `/reviews/weekly`
- `/portfolio`
- `/market`
- `/tutorials`
- `/tutorials/articles`
- `/tutorials/videos`
- `/tutorials/infographics`
- `/tools`
- `/nav`
- `/nav/stocks`
- `/nav/funds`
- `/nav/etf`
- `/nav/stocks-cn`
- `/nav/options`
- `/nav/overseas-banks`
- `/nav/overseas-brokers`
- `/nav/fund-transfer`
- `/about`
