import req from '../utils/request'
import "./api";


// 获取菜单列表
export const getMenuList = () => { return req.get(`/uaa/users/menu`); };
