# mini-request

对小程序wx.request ,wx.upload 等封装统一的入口、参数处理；添加 拦截器 对请求和响应做一些处理，风格类似 axios

## todo

- form-data 
- download

## 使用

### 实例

引入 mini-request 后需要 通过 new 实例化 request 对象，可以设置一些默认参数

```js
// 可以在初始化时设置的参数即默认值
const request = new Request({
  method: 'GET',
  dataType: 'json',
  responseType: 'text',
  fileName: 'file',
  header:  { 'Content-Type': 'application/json' }
})
```



### 拦截器

- 请求前拦截

    ```js
    // config 对象为请求中的所有参数，必须把config return 回去，
    // 第二个参数 是一个cancel函数，执行可以取消本次请求
    request.interceptor.request(function (config) {
      // console.log(config, store.data)
      if (store.data.token) {
        config.data.key = store.data.token
        config.params.key = store.data.token
      }
    
      return config
    })
    ```

- 请求后拦截

    请求后拦截分为 正常返回  和 异常 返回（wx.request 中 res.statusCode !== 200 ）

    ```js
    // 请求后拦截 可以对异常进行统一处理
    request.interceptor.response(
      function (res) {
    		return res
      },
      function (_res) {}
    )
    ```

    

### 别名

- request.get(url, params, options)
- request.post(url, data, options)
- upload(url, filePath, options)



### options

- baseUrl

    基础路径 如果url不是以http开头，则会拼接 baseUrl 和 url

- method

    请求方法

- url

- params

    url 中的路径参数， 使用对象形式, 自动转成 字符串

    ```js
    {
    	a: '1'
    	b: '2'
    }
    // 结果 url?a=1&b=2
    ```

- data

    请求体中的参数

- header

- dataType

    同 wx.request

- responseType

    同 wx.request

- timeout

    同 wx.request

- filePath

    上传文件时的路径

- fileName

    上传文件时的文件名

- onUploadProgress

    监听上传进度

- getTask

    回调参数是 wx.request 或者 wx.upload 的实例





## 版本

### 1.0.0