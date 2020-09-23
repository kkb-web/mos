// 取 id -
const pathId = () => {
  let path = window.location.pathname.split('/')
  return parseInt(path[path.length - 1])
}
export { pathId }
