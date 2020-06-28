'use strict'
import ResponseError from './response-error'
import ResponseStatus from './response-status'

class Response {
  constructor(res) {
    this.response = res
  }
  handler(successCallback, errorCallback) {
    const status = this.getStatus()
    if (status.isError()) {
      return errorCallback(status)
    } else {
      return successCallback(this)
    }
  }
  getStatus() {
    return new ResponseStatus(this.getBody().status)
  }
  getData() {
    return this.getBody().data
  }
  getPaginated() {
    return this.getBody().paginated
  }
  getBody() {
    return this.getResponse().data
  }
  getHeader() {
    return this.getResponse().header
  }
  getCookies() {
    return this.getResponse().cookies
  }
  getResponse() {
    return this.response
  }
  getConfig() {
    return this.getResponse().config
  }
}

export { Response, ResponseStatus, ResponseError }
