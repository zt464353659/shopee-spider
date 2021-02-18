# Shopee-Api

#### 首先确保Node是最新版本，你也可以去官网[下载]("https://nodejs.org/zh-cn/download/", "NodeJs下载")；因为安装puppeteer依赖包比较慢，优先推荐使用yarn安装依赖

### yarn安装

    npm install yarn -g

### pm2安装

    npm install pm2 -g

#### 安装依赖

    npm install or yarn install

#### npm启动项目

    npm run dev or yarn run dev

#### pm2启动项目

    pm2 start pm2.ecsystem.json 

#### webpack打包项目

    webpack ./src/app.js

#### 项目pkg打包

    npm run pkg

#### 项目目录结构解析

    Shopee-Api
        │
        │         
        └──Code  																					 // 项目代码根目录
        │    │  
        │    │  
        │    │          
        │    └─Middleend 																			 // 中端服务更目录
        │    │    │
        │    │    │     .babelrc 																	 // babel-loader 配置
        │    │    │
        │    │    │     .eslintrc.js 																 // eslint语法检测配置
        │    │    │
        │    │    │     .postcssrc.js 																 // css样式自动转化配置
        │    │    │
        │    │    │     pm2.ecosystem.json 															 // 项目管理pm2配置
        │    │    │
        │    │    │     webpack.config.js 															 // 项目webpack编译配置
        │    │    │
        │    │    │     package.json 																 // 项目依赖包配置
        │    │    │
        │    │    │     README.md 																	 // 项目基础操作文档
        │    │    │  
        │    │    ├─config
        │    │    │  │
        │    │    │  ├─  config.js 																	 // 项目静态资源配置
        │    │    │  │
        │    │    │  └─
        │    │    │      
        │    │    ├─src 																			 // 服务根目录
        │    │    │  │
        │    │    │  ├─controllers 																	 // 项目逻辑层
        │    │    │  │  │
        │    │    │  │  ├─chat 																		 // 聊天模块业务逻辑
        │    │    │  │  │
        │    │    │  │  ├─fans 																		 // 粉丝模块业务逻辑
        │    │    │  │  │
        │    │    │  │  ├─ offer 																	 // 议价业务逻辑
        │    │    │  │  │
        │    │    │  │  ├─ order 																	 // 订单业务逻辑
        │    │    │  │  │
        │    │    │  │  ├─ product 																	 // 产品业务逻辑
        │    │    │  │  │
        │    │    │  │  ├─ sellerlogin 																 // 卖家中心业务逻辑
        │    │    │  │  │
        │    │    │  │  ├─ shope 																	 // 店铺信息业务逻辑
        │    │    │  │  │
        │    │    │  │  ├─ shopee 																	 // shopee其他api业务逻辑
        │    │    │  │  │
        │    │    │  │  └─
        │    │    │  │      
        │    │    │  ├─errorException 																 // 错误类型定义目录
        │    │    │  │  │      
        │    │    │  │  ├─ apiError.js 																 // 错误类型函数封装
        │    │    │  │  │      
        │    │    │  │  ├─  apiErrorDefines.js 														 // 错误类型定义
        │    │    │  │  │      
        │    │    │  │  └─ 
        │    │    │  │
        │    │    │  │          
        │    │    │  ├─middleware 																	 // 中间件目录
        │    │    │  │  │    
        │    │    │  │  ├─ header.js 																 // 请求头中间件
        │    │    │  │  │    
        │    │    │  │  ├─ input.js 																 // 参数获取中间件
        │    │    │  │  │   
        │    │    │  │  ├─ requestError.js 															 // 请求错误错误日志记录
        │    │    │  │  │    
        │    │    │  │  ├─ routePermission.js 														 // 请求权限拦截
        │    │    │  │  │
        │    │    │  │  └─ 
        │    │    │  │          
        │    │    │  ├─request
        │    │    │  │  │
        │    │    │  │  ├─chat 																		 // 聊天模块平台api请求
        │    │    │  │  │
        │    │    │  │  ├─fans 																		 // 粉丝模块平台api请求
        │    │    │  │  │
        │    │    │  │  ├─ offer 																	 // 议价业务平台api请求
        │    │    │  │  │
        │    │    │  │  ├─ order 																	 // 订单业务平台api请求
        │    │    │  │  │
        │    │    │  │  ├─ product 																	 // 产品业务平台api请求
        │    │    │  │  │
        │    │    │  │  ├─ sellerlogin 																 // 卖家中心业务平台api请求
        │    │    │  │  │
        │    │    │  │  ├─ shope 																	 // 店铺信息业务平台api请求
        │    │    │  │  │
        │    │    │  │  ├─ shopee 																	 // shopee其他api业务平台api请求
        │    │    │  │  │
        │    │    │  │  ├─ api.js 																	 // 平台api模块化暴露
        │    │    │  │  │
        │    │    │  │  ├─ axios.instance.js 														 // axios请求封装
        │    │    │  │  │
        │    │    │  │  └─ 
        │    │    │  │  
        │    │    │  │        
        │    │    │  ├─router 																		 // api 路由定义目录
        │    │    │  │  │
        │    │    │  │  ├─chat 																		 // 聊天模块平台api请求
        │    │    │  │  │
        │    │    │  │  ├─fans 																		 // 粉丝模块平台api请求
        │    │    │  │  │
        │    │    │  │  ├─ offer 																	 // 议价业务平台api请求
        │    │    │  │  │
        │    │    │  │  ├─ order 																	 // 订单业务平台api请求
        │    │    │  │  │
        │    │    │  │  ├─ product 																	 // 产品业务平台api请求
        │    │    │  │  │
        │    │    │  │  ├─ sellerlogin 																 // 卖家中心业务平台api请求
        │    │    │  │  │
        │    │    │  │  ├─ shope 																	 // 店铺信息业务平台api请求
        │    │    │  │  │
        │    │    │  │  ├─ shopee 																	 // shopee其他api业务平台api请求
        │    │    │  │  │
        │    │    │  │  ├─ index.js 																 // api路由合并处理
        │    │    │  │  │
        │    │    │  │  └─       
        │    │    │  │          
        │    │    │  │          
        │    │    │  ├─ util 																		// 工具类目录
        │    │    │  │  │
        │    │    │  │  ├─log 																		// 日志输出目录
        │    │    │  │  │
        │    │    │  │  ├─ baseData.js 																// 第三方平台api URL配置
        │    │    │  │  │
        │    │    │  │  ├─ logger.js 																// 日志记录封装
        │    │    │  │  │
        │    │    │  │  ├─ requestValidator.js 														// 服务请求验证
        │    │    │  │  │
        │    │    │  │  ├─ response.js 																// 返回数据格式封装
        │    │    │  │  │
        │    │    │  │  ├─ utils.js 																// 常用类封装(错误类型抛出、puppeteer打包路径、请求header设置等)
        │    │    │  │  │
        │    │    │  │  └─       
        │    │    │  │          
        │    │    │  │          
        │    │    │  ├─validation 																	// 参数验证目录
        │    │    │  │  ├─ conversation.js 															// 聊天模块平台api请求
        │    │    │  │  │
        │    │    │  │  ├─ dts.js 																	// 粉丝模块平台api请求
        │    │    │  │  │
        │    │    │  │  ├─ follow.js 																// 议价业务平台api请求
        │    │    │  │  │
        │    │    │  │  ├─ logistics.js 															// 订单业务平台api请求
        │    │    │  │  │
        │    │    │  │  ├─ message.js 																// 产品业务平台api请求
        │    │    │  │  │
        │    │    │  │  ├─ offer.js 																// 卖家中心业务平台api请求
        │    │    │  │  │
        │    │    │  │  ├─ order.js 																// 店铺信息业务平台api请求
        │    │    │  │  │
        │    │    │  │  ├─ performance.js 															// shopee其他api业务平台api请求
        │    │    │  │  │
        │    │    │  │  ├─ product.js 																// api路由合并处理
        │    │    │  │  │
        │    │    │  │  │
        │    │    │  │  ├─ shope.js 																// api路由合并处理
        │    │    │  │  │
        │    │    │  │  │
        │    │    │  │  ├─ user.js 																	// api路由合并处理
        │    │    │  │  │
        │    │    │  │  └─   
        │    │    │  │      
        │    │    │  │  
        │    │    │  └─app.js 																		// 项目入口文件
        │    │    │     
        │    │    └─
        │    │     
        │    │      
        │    │      
        │    └──Backend
        │         │
        │         └─ shell 																			// shell脚本目录
        │             │
        │             └─ supervisor  																// supervisor目录
        │             │    │
        │             │    └─ conf 																	// supervisor配置目录
        │             │       │
        │             │       └─ shopee-api.conf 													// supervisor配置文件
        │             │
        │             └─ init.sh  																	// shell脚本
        │
        │
        └──DOcument
        │    │
        │    └─ Shopee-Api使用手册.pdf 																 // shopee-api使用手册
        │
        │      
        └──.gitignore 																				// git忽略配置
        │
        │     
        └── LICENSE 																				// 许可证
        │
        │
        └──README.md 																				// readme文档

### 本地环境启动需要将环境变量设置为 develop
    具体注释config/config.js 第九行代码
    
    主要是为了输出日志和puppeteer模拟完成后需kill掉chromium进程

    // 本地测试不用传SIGHUP，此命令是针对Linux系统
    if (process.env.NODE_ENV === 'production') {
        browser.process().kill('SIGHUP') 
    } else {
        await browser.process().kill()
    }

### 生产环境启动需要将环境变量设置为 production

    具体注释config/config.js 第八行代码