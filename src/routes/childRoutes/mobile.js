import Index from '../../components/mobile/Index';
import AddUser from '../../components/mobile/AddUser';
import AddUserSuccess from '../../components/mobile/AddUserSuccess';
import AddUserError from '../../components/mobile/AddUserError';
import AddOrder from '../../components/mobile/AddOrder';
import AddOrderSuccess from '../../components/mobile/AddOrderSuccess';
import AddOrderError from '../../components/mobile/AddOrderError';
import GetApplyTable from '../../components/mobile/GetApplyTable';
import ApplyDetail from '../../components/mobile/ApplyDetail';
import NoAuthor from '../../components/mobile/NoAuthor';

const mobile = [
    {
        path: '/dingtalk',
        component: Index,
    },
    {
        path: '/user/add',
        component: AddUser,
    },
    {
        path: '/user/add/success',
        component: AddUserSuccess,
    },
    {
        path: '/user/add/error',
        component: AddUserError,
    },
    {
        path: '/order/add',
        component: AddOrder,
    },
    {
        path: '/order/add/success',
        component: AddOrderSuccess,
    },
    {
        path: '/order/add/error',
        component: AddOrderError,
    },
    {
        path: '/order/add/apply',
        component: GetApplyTable,
    },
    {
        path: '/detail/:orderId/:id',
        component: ApplyDetail,
    },
    {
        path: '/author/none',
        component: NoAuthor,
    }
];

export default mobile;
