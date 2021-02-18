/*
 * @Author: zhangzhengzhe
 * @Date: 2019-06-20 16:47:14
 * @LastEditors: zhangzhengzhe
 * @LastEditTime: 2019-09-11 16:10:59
 */
'use strict'
// process.env.NODE_ENV = 'develop'
// process.env.NODE_ENV = 'production'
const utils = require('./../src/util/utils')
const path = require('path')
const config = {

  /**
   * 默认端口
   */

  port: 3006,

  /**
   * 跨域设置
   */

  corsOptions: {
    origin: '*',
    credentials: true,
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    allowMethods: ['OPTIONS', 'GET', 'PUT', 'POST', 'DELETE'],
    allowHeaders: ['x-requested-with', 'accept', 'origin', 'content-type'],
    maxAge: 1728000
  },

  /**
   * 上传文件处理
   */

  corsBodyParser: {
    // encoding: 'gzip, deflate, br',
    multipart: true, // 支持ctx.request.body获取formdata
    strict: false,
    patchKoa: true,
    patchNode: true,
    urlencoded: true,
    formidable: {
      multipart: true,
      uploadDir: path.join(process.cwd() + '/src/public/temp/'), // 设置文件上传目录
      keepExtensions: true, // 保持文件的后缀
      maxFieldsSize: 2097152, // 文件上传大小 2 * 1024 * 1024
      onFileBegin: (name, file) => { // 文件上传前的设置
        const fp = path.join(process.cwd() + '/src/public/temp/')
        // 检查是否有“temp”文件夹
        if (!fs.existsSync(fp)) {
          fs.mkdirSync(fp) // 没有就创建
        }
        const fileName = file.name.split('/')[file.name.split('/').length - 1]
        // 指定上传文件的名称
        file.path = path.join(process.cwd() + '/src/public/temp/' + fileName)
      }
    },
    onError: err => {
      console.log(err)
    }
  },
  /**
   * @description: 存储puppeteer实例
   */
  initPuppeteer: {}, 
  /** 
 * @description: 创建浏览器最小数和最大数
 *
  *
  * @param { Object } [options={}] 创建池的配置配置
  * @param { Number } [options.max=10] 最多产生多少个 puppeteer 实例 。如果你设置它，请确保 在引用关闭时调用清理池。 pool.drain().then(()=>pool.clear())
  * @param { Number } [options.min=1] 保证池中最少有多少个实例存活
  * @param { Number } [options.testOnBorrow=2048] 在将 实例 提供给用户之前，池应该验证这些实例。
  * @param { Boolean } [options.autostart=false] 是不是需要在 池 初始化时 初始化 实例
  * @param { Number } [options.idleTimeoutMillis=3600000] 如果一个实例 60分钟 都没访问就关掉他
  * @param { Number } [options.evictionRunIntervalMillis=180000] 每 3分钟 检查一次 实例的访问状态
  * @param { Object } [options.puppeteerArgs={}] puppeteer.launch 启动的参数
  * @param { Function } [options.validator=(instance)=>Promise.resolve(true))] 用户自定义校验 参数是 取到的一个实例
  * @return { Object } pool
  */
  pool: {
    min: 1, // 最小创建资源数
    max: 6, // 最大创建资源数
    testOnBorrow: true, // 验证资源池
    autostart: false, // 通过调用pool.start 启用
    fifo: true, // true:则最早的资源将首先被分配 false:将首先分配最近释放的资源
    evictionRunIntervalMillis: 180000, // 多长时间运行一次驱逐检查(预设3分钟)
    numTestsPerEvictionRun: 9, // 每次驱逐检测数量
    maxWaitingClients: 3, // 允许的已排队请求的最大数量
    idleTimeoutMillis: 3600000, // 对象因空闲时间而有资格被驱逐之前在池中空闲的最短时间(即在池中可以悠闲地生存时间)
    validator: () => Promise.resolve(true)
  },

  /**
   * puppeteer性能配置
   * */

  browserOption: {
    headless: Boolean(process.env.MSF_ENV === 'docker'),
    // slowMo: process.env.MSF_ENV === 'docker' ? 0 : 200,
    devtools: Boolean(process.env.MSF_ENV !== 'docker'),
    // timeout: 6000000, // 1000 * 6000
    defaultViewport: {
      width: 1280,
      height: 700
    },
    ignoreHTTPSErrors: true,
    pipe: true, // 不使用websocket
    // dumpio: true, // 是否将浏览器进程标准输出和标准错误输入到 process.stdout 和 process.stderr 中。默认是 false。(有点坑、只要页面出错就会一直打开)
    // args: process.env.NODE_ENV === 'develop' ? [
    args: Boolean(process.env.MSF_ENV === 'docker') ? [
      // '--proxy-server=socks5://190.168.0.103:1080'
      '--no-sandbox', // 禁用沙箱
      '--disable-setuid-sandbox', // 禁用setuid沙箱(仅限Linux)
      '--headless', // 运行无头模式
      '--no-zygote', // 禁用分发子进程
      '--disable-gpu', // 禁用gpu
      '--no-first-run', // 跳过首次运行
      '--disable-dev-shm-usage' // 始终使用临时目录创建匿名共享内存文件
      // '--single-process', // 单进程
      // '--disable-web-security' // 不执行同源策略
    ] : [
      // '--proxy-server=socks5://190.168.3.159:1080',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-features=site-per-process'
    ],
    executablePath: utils.initChromiumPath() // 引用本地依赖chromium
  },

  /**
   * 设置超时时间
   */

  timeout: 6000000, // 1000 * 6000

  /** 
   * @description: 请求需要拦截的类型
   */
  intercepterList: ['document', 'stylesheet', 'image', 'font', 'texttrack', 'eventsource', 'manifest', 'other'],

  /**
   * 设置cookie
   */

  cookies: [], // 1000 * 6000

  /**
   * 设置puppeteer中的ua
  */

  ua: Boolean(process.env.MSF_ENV === 'docker') ?
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.56 Safari/537.17' :
    'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',

  /**
     * develop 开发环境
     * test 测试环境
     * production 生产环境
     */

  'env': 'production',

  /**
     * debug: 是否开启debug模式
     * true 开启，错误信息输出到客户端和日志文件
     * false 关闭，错误信息仅输出到日志文件
     */

  'debug': false,

  /**
   * logPath: 日志存储目录
  */

  'logPath': '/logs/',

  /**
 * deviceId: 设备ID
 */

  deviceId: 'a193f85f-3520-42e2-8d3c-7b68ccab17ef'
}
module.exports = config
