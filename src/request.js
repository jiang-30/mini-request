'use strict'
class Request {
  constructor(config) {
    this.defaults = {
      baseUrl: '',
      header: {
        'content-type': 'application/json',
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      custom: {},
    }
    this.interceptor = {
      request: (cb) => {
        if (cb) {
          this.requestBeforeFun = cb
        }
      },
      response: (cb, ecb) => {
        if (cb) {
          this.requestComFun = cb
        }
        if (ecb) {
          this.requestComFail = ecb
        }
      },
    }
    this.defaults = Object.assign({}, this.defaults, config)
  }
  requestBeforeFun(config, _ancel) {
    return config
  }
  requestComFun(response) {
    return response
  }
  requestComFail(response) {
    return response
  }
  validateStatus(statusCode) {
    return statusCode === 200
  }
  handler(options, callback) {
    let _options = {}
    _options.method = options.method || this.defaults.method
    _options.baseUrl = this.defaults.baseUrl
    _options.url = options.url || ''
    _options.params = options.params || {}
    _options.data = options.data || {}
    _options.header = Object.assign({}, this.defaults.header, options.header || {})
    _options.dataType = options.dataType || this.defaults.dataType
    _options.responseType = options.responseType || this.defaults.responseType
    _options.timeout = options.timeout || this.defaults.timeout
    _options.filePath = options.filePath || ''
    _options.fileName = options.fileName || 'file'
    _options.onUploadProgress = options.onUploadProgress
    _options.getTask = options.getTask || this.defaults.getTask
    _options.loading = options.loading || false
    _options.custom = Object.assign({}, this.defaults.custom, options.custom || {})
    _options.onError = options.onError
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
      const _config = this.requestBeforeFun(_options, cancel)
      if (!next) return
      if (_config.loading) {
        wx.showLoading({ title: '加载中...' })
      }
      _config.path = Request.mergeUrl(_config.url, _config.baseUrl, _config.params)
      callback(_config, resolve, reject)
    })
  }
  handlerResult(response, config, resolve, reject) {
    response.config = config
    if (this.validateStatus(response.statusCode)) {
      response = this.requestComFun(response)
      Promise.resolve()
        .then(() => response)
        .then((res) => resolve(res))
        .catch((err) => reject(err))
    } else {
      response = this.requestComFail(response)
      reject(response)
    }
    if (config.loading) {
      wx.hideLoading()
    }
  }
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
  uploadFile(options) {
    return this.handler(options, (_config, resolve, reject) => {
      console.log(_config)
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
  get(url, params, options = {}) {
    return this.request(Object.assign({ method: 'GET', url: url + params }, options))
  }
  post(url, data, options = {}) {
    return this.request(Object.assign({ method: 'POST', url, data }, options))
  }
  upload(url, filePath, options) {
    return this.uploadFile(Object.assign({ url, filePath }, options))
  }
  download() {}
  static posUrl(url) {
    return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
  }
  static mergeUrl(url, baseUrl, params) {
    let mergeUrl = Request.posUrl(url) ? url : `${baseUrl}${url}`
    if (Object.keys(params).length !== 0) {
      const paramsH = Request.addQueryString(params)
      mergeUrl += mergeUrl.includes('?') ? `&${paramsH}` : `?${paramsH}`
    }
    return mergeUrl
  }
  static addQueryString(params) {
    let paramsData = ''
    Object.keys(params).forEach(function (key) {
      paramsData += key + '=' + encodeURIComponent(params[key]) + '&'
    })
    return paramsData.substring(0, paramsData.length - 1)
  }
}

export default Request
