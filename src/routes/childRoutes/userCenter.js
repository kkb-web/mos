import MyUserList from '../../components/userCenter/myUser/MyUserList';
import AddMyUser from '../../components/userCenter/myUser/AddMyUser';
import EditMyUser from '../../components/userCenter/myUser/EditMyUser';

import OrderUserList from '../../components/userCenter/orderUser/OrderUserList';
import EditOrderUser from '../../components/userCenter/orderUser/EditOrderUser';


const userCenter = [
    {
        path: '/app/usercenter/myuser',
        component: MyUserList,
    },
    {
        path: '/app/usercenter/myUser/add',
        component: AddMyUser,
    },
    {
        path: '/app/usercenter/myUser/:id',
        component: EditMyUser,
    },
    {
        path: '/app/usercenter/orderuser',
        component: OrderUserList,
    },
    {
        path: '/app/usercenter/orderuser/:id',
        component: EditOrderUser,
    }
];

export default userCenter;