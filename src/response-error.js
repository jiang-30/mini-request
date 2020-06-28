'use strict'
export default class ResponseError {
  constructor(code, message) {
    this.code = code
    this.message = message
  }
  getCode() {
    return this.code
  }
  getMessage() {
    return this.message
  }
}
