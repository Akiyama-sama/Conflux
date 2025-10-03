# 项目简介

这是一个AI+暴雨防涝的智能化平台，目前只是一个纯前端实现
主要技术栈：
- React+Vite+TypeScript 实现类型安全，复杂度可控的迅捷前端开发
- TanStack Router 实现文件路由
- Zustand 负责状态管理
- MapBox GL 实现的地图加载与图层管理
- Tailwind CSS + Shadcn UI 组件库

# 项目演示

![](https://github.com/Akiyama-sama/Conflux/blob/2cf20a0aa035cc1c6af0d38646950b2e0526bdf3/public/short-cut0.png?raw=true)
![](https://github.com/Akiyama-sama/Conflux/blob/2cf20a0aa035cc1c6af0d38646950b2e0526bdf3/public/short-cut1.png?raw=true)
![](https://github.com/Akiyama-sama/Conflux/blob/2cf20a0aa035cc1c6af0d38646950b2e0526bdf3/public/short-cut2.png?raw=true)
![](https://github.com/Akiyama-sama/Conflux/blob/2cf20a0aa035cc1c6af0d38646950b2e0526bdf3/public/short-cut3.png?raw=true)



# 部署项目

```bash

git clone https://github.com/Akiyama-sama/Conflux
cd Conflux
pnpm i

```
然后去MapBox官网申请 API Token （个人5万次免费请求，开发够用）
地址：https://www.mapbox.com/

来到项目根目录，找到.env.example文件
粘贴Token到VITE_MAPBOX_ACCESS_TOKEN这里

```bash

pnpm run dev

```
打开浏览器路由http://localhost:3000/



