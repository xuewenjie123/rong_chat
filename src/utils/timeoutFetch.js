const timeoutFetch = (fetch, timeout = 10000) => {
  let timeoutBlock = () => {}
  let timeout_promise = new Promise((resolve, reject) => {
    timeoutBlock = () => {
      // 请求超时处理
      reject('请求超时')
    }
  })
  let abortable_promise = Promise.race([
    fetch,
    timeout_promise
  ])
  setTimeout(() => {
      timeoutBlock()
    },
    timeout)
  return abortable_promise
}
export default timeoutFetch;