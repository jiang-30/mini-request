'use strict'
export default class ResponseStatus {
  constructor(status) {
    this.status = status
  }
  isSuccess() {
    return this.status.succeed === 1
  }
  isError() {
    return this.status.succeed === 0
  }
  getError() {
    if (!this.isSuccess()) {
      if (!this.error) {
        this.error = new ResponseError(this.status.error_code, this.status.error_desc)
      }
      return this.error
    } else {
      return null
    }
  }
  getErrorCode() {
    if (this.getError()) {
      return this.getError().getCode()
    } else {
      return ''
    }
  }
  getErrorMessage() {
    if (this.getError()) {
      return this.getError().getMessage()
    } else {
      return ''
    }
  }
}
