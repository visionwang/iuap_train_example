
# iuap 前端开发框架脚手架（React）

### 1、开发准备
> 需要提前安装全局的 Node 环境

```
$ git clone git@github.com:yangchch6/iuap_train_example.git
$ cd iuap_train_example
$ npm install
$ npm run dev
```

> 启动成功后访问页面[http://127.0.0.1:3000/fe/order_info#/]
加载成功后台数据，说明前后台搭建成功

### 2、框架目录与规范


**（1）根目录结构说明：**

```

├── build               # 构建产出后待部署的前端静态资源   
├── mock                # 本地数据模拟       
├── gulpfile.js         # 执行发布到 MAVEN 的配置
├── postcss.config.js
├── src                 # 开发源代码
├── uba.config.js       # 开发框架构建配置文件
└── uba.mock.js
```

**（2）src 源码目录结构说明：**

```
├── app.jsx             # 应用主逻辑入口
├── app.less
├── index.html
├── components          # 应用级公共组件
├── layout              # 整体布局类组件
├── pages               # 所有业务模块代码
├── static              # 图片，图标字体等资源
└── utils               # 通用工具类封装
```

**（3）业务模块目录说明：(以请购单业务模块为例)**
```
├── order_info                  # 业务模块名称（目录）
│   ├── components              # 该页面下的组件目录，子组件都放在这里
│   │   ├── Orderinfo-edit      # 新增、编辑、查看公共页
│   │   ├── Orderinfo-form      # 单表搜索面板
│   │   ├── Orderinfo-root      # 单表页面
│   │   └── Orderinfo-table     
│   ├── routes                  # 模块路由配置文件
│   │   ├── index.jsx           # 主路由
│   │   └── child               # 子路由
│   ├── app.jsx                 # 节点逻辑入口文件
│   ├── container.js            # 容器组件，实现mirror model与组件的连接
│   ├── index.html              # 节点入口文件
│   ├── model.js                # mirror 模型定义文件，定义公共state及公共方法
│   └── service.js              # 定义具体请求及相关URL地址

```

### 3、框架规范说明

开发框架遵循公共的前端开发规范，我们约定以一致的规范来进行团队协作。具体内容请查看这里：[https://github.com/iuap-design/YY-Code-Guide](https://github.com/iuap-design/YY-Code-Guide)。

包含以下内容：

- [x] [命名规则和目录规范](./命名规则.md)
- [x] [HTML 编码规范](./HTML.md)
- [x] [CSS 编码规范](./CSS.md)
- [x] [JavaScript 编码规范](./JavaScript.md)
- [x] [React 组件开发规范](./React.md)
- [x] [基于 React 的项目开发规范](./React项目开发规范.md)
- [x] [规范的落地：编辑器配置和构建流程集成](./编辑器配置和相应构建检查.md)
- [x] [性能优化相关方案及规范](./性能优化相关方案及规范.md)
