# 美股 Dashboard

## 项目结构

```text
demo_stock_investor/
├─ src/
│  ├─ components/
│  │  ├─ common/
│  │  │  ├─ Card.tsx
│  │  │  ├─ Gauge.tsx
│  │  │  └─ MiniChart.tsx
│  │  ├─ dashboard/
│  │  │  ├─ IndexCards.tsx
│  │  │  ├─ NewsTicker.tsx
│  │  │  ├─ StockList.tsx
│  │  │  └─ StockDetailPanel.tsx
│  │  └─ layout/
│  │     └─ DashboardLayout.tsx
│  ├─ types/
│  │  └─ stock.ts
│  ├─ utils/
│  │  ├─ api.ts
│  │  └─ formatters.ts
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ index.css
├─ public/
├─ package.json
├─ tailwind.config.js
├─ tsconfig.app.json
├─ tsconfig.node.json
└─ vite.config.ts
```

## 启动方式

```bash
npm install
npm run dev
```

## 指标计算逻辑参考

- 指标计算逻辑参考文档：`c:\Users\yinsh\Desktop\Nomici\demo_stock_investor\.trae\documents\stock_dashboard_prd_data_ux_cn.md`

默认地址：

```text
http://localhost:5173
```
