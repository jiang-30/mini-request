/**
 * 路径参数和url拼接
 * @param { string } baseUrl
 * @param { string } url
 * @param { object } params
 */
export function mergeUrl(baseUrl, url, params = {}) {
  let mergeUrl = posUrl(url) ? url : `${baseUrl}${url}`
  if (Object.keys(params).length !== 0) {
    const paramsH = addQueryString(params)
    mergeUrl += mergeUrl.includes('?') ? `&${paramsH}` : `?${paramsH}`
  }
  return mergeUrl
}

/**
 * 判断是否是绝对路径
 * @param {*} url
 */
export function posUrl(url) {
  return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
}
/**
 * 查询字符串格式化
 * @param { object } params
 */
export function addQueryString(params) {
  let paramsData = ''
  Object.keys(params).forEach(function (key) {
    paramsData += key + '=' + encodeURIComponent(params[key]) + '&'
  })
  return paramsData.substring(0, paramsData.length - 1)
}
