'use strict'
import { mergeUrl } from './tools'

/**
 * defaultConfig
 * @param { Object } DefaultConfig
 * @param { string } [config.baseUrl]
 * @param { string } [config.method]
 * @param { string } [config.dataType]
 * @param { string } [config.responseType]
 * @param { string } [config.fileName]
 * @param { boolean } [config.showLoading]
 * @param { object } [config.header]
 * @param { object } [config.custom]
 */

/**
 * request参数
 * @typedef RequestOptions
 * @property { 'GET' | 'POST' } method
 * @property { string } url
 * @property { Object } params
 * @property { Object } data
 * @property { Object } header
 * @property { string } dataType
 * @property { string } responseType
 * @property { number } timeout
 * @property { function } getTask
 * @property { boolean } showLoading
 * @property { Object } custom
 */

/**
 * upload参数
 * @typedef UploadOptions
 * @property { string } url
 * @property { Object } params
 * @property { string } filePath
 * @property { string } fileName
 * @property { Object } data
 * @property { Object } header
 * @property { string } dataType
 * @property { function } getTask
 * @property { boolean } showLoading
 * @property { Object } custom
 */

/**
 * 请求封装
 */
class Request {
  /**
   * @param { DefaultConfig } config
   */
  constructor(config = {}) {
    // 默认参数
    let defaults = {}
    defaults.baseUrl = config.baseUrl || ''
    defaults.method = config.method || 'GET'
    defaults.dataType = config.dataType || 'json'
    defaults.responseType = config.responseType || 'text'
    defaults.fileName = config.fileName || 'file'
    defaults.showLoading = config.showLoading || false
    defaults.header = {
      'Content-Type': 'application/json',
      ...config.header,
    }
    defaults.custom = config.custom || {}
    this.defaults = defaults

    // 拦截器初始化
    this.interceptor = {
      request: (cb) => {
        if (cb) {
          this._requestBeforeFun = cb
        }
      },
      response: (cb, ecb) => {
        if (cb) {
          this._requestComFun = cb
        }
        if (ecb) {
          this._requestComFail = ecb
        }
      },
    }
  }

  /**
   * 请求前拦截
   * @private
   */
  _requestBeforeFun(config, _ancel) {
    return config
  }

  /**
   * 请求后拦截
   * @private
   */
  _requestComFun(response) {
    return response
  }

  /**
   * 请求失败拦截
   * @private
   */
  _requestComFail(response) {
    return response
  }

  /**
   * 定义失败
   */
  validateStatus(statusCode) {
    return statusCode === 200
  }

  /**
   * get请求别名
   * @param { string } url
   * @param { Object } params
   * @param { RequestOptions } options
   * @returns { Promise<any> }
   */
  get(url, params = {}, options = {}) {
    return this.request(Object.assign({ method: 'GET', url, params }, options))
  }
  /**
   * post请求别名
   * @param { string } url
   * @param { Object } data
   * @param { RequestOptions } options
   * @returns { Promise<any> }
   */
  post(url, data = {}, options) {
    return this.request(Object.assign({ method: 'POST', url, data }, options))
  }
  /**
   * upload请求别名
   * @param { string } url
   * @param { string } filePath
   * @param { UploadOptions } options
   */
  upload(url, filePath, options = {}) {
    options.header = options.header || {}
    options.header['Content-Type'] = 'multipart/form-data'
    return this.uploadFile(Object.assign({ url, filePath }, options))
  }

  /**
   * download请求别名
   * @param { string } url
   * @param { string } filePath
   * @param { object } options
   */
  download() {}

  /**
   *  网路请求
   * @param { RequestOptions } options
   */
  request(options) {
    return this.handler(options, (_config, resolve, reject) => {
      const requestTask = wx.request({
        url: _config.path,
        data: _config.data,
        header: _config.header,
        method: _config.method,
        dataType: _config.dataType,
        responseType: _config.responseType,
        complete: (response) => {
          this.handlerResult(response, _config, resolve, reject)
        },
      })
      if (_config.getTask) {
        _config.getTask(requestTask, _config)
      }
    })
  }

  /**
   * 上传
   * @private
   * @param { object } options
   */
  uploadFile(options) {
    return this.handler(options, (_config, resolve, reject) => {
      const uploadTask = wx.uploadFile({
        url: _config.path,
        filePath: _config.filePath,
        name: _config.fileName,
        formData: _config.data,
        header: _config.header,
        complete: (response) => {
          if (_config.dataType == 'json') {
            response.data = JSON.parse(response.data)
          }
          this.handlerResult(response, _config, resolve, reject)
        },
      })
      if (_config.getTask) {
        _config.getTask(uploadTask, _config)
      }
      if (_config.onUploadProgress) {
        uploadTask.onProgressUpdate(_config.onUploadProgress)
      }
    })
  }
  downLoadFile(_options) {}

  /**
   * @private
   */
  handler(options, callback) {
    let _options = {}
    _options.baseUrl = this.defaults.baseUrl
    _options.method = options.method || this.defaults.method
    _options.url = options.url || ''
    _options.params = options.params || {}
    _options.data = options.data || {}
    _options.header = Object.assign({}, this.defaults.header, options.header || {})
    _options.dataType = options.dataType || this.defaults.dataType
    _options.responseType = options.responseType || this.defaults.responseType
    _options.timeout = options.timeout || this.defaults.timeout
    _options.filePath = options.filePath || ''
    _options.fileName = options.fileName || this.defaults.fileName
    _options.onUploadProgress = options.onUploadProgress
    _options.getTask = options.getTask || this.defaults.getTask
    _options.showLoading = options.showLoading || this.defaults.showLoading
    _options.custom = Object.assign({}, this.defaults.custom, options.custom || {})

    return new Promise((resolve, reject) => {
      let next = true
      const cancel = (message = 'handle cancel', config = _options) => {
        const err = {
          errMsg: message,
          config: config,
        }
        reject(err)
        next = false
      }
      const _config = this._requestBeforeFun(_options, cancel)
      if (!next) return
      if (_config.showLoading) {
        wx.showLoading({ title: '加载中...' })
      }
      _config.path = mergeUrl(_config.baseUrl, _config.url, _config.params)
      callback(_config, resolve, reject)
    })
  }
  /**
   * @private
   */
  handlerResult(response, config, resolve, reject) {
    response.config = config
    if (this.validateStatus(response.statusCode)) {
      response = this._requestComFun(response)
      Promise.resolve()
        .then(() => response)
        .then((res) => resolve(res))
        .catch((err) => reject(err))
    } else {
      response = this._requestComFail(response)
      reject(response)
    }
    if (config.showLoading) {
      wx.hideLoading()
    }
  }
}

export default Request
