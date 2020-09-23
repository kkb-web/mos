import Form from '../../components/system/roles/Form';
import AddRole from '../../components/system/roles/AddRole'
import EditRole from '../../components/system/roles/EditRole'
import CopyRole from '../../components/system/roles/CopyRole'
import Market from '../../components/system/marketing/Marketing'

//设备管理
import DeviceManagement from '../../components/system/device/Devices';
import AddDevice from '../../components/system/device/AddDevice';
import EditDevice from '../../components/system/device/EditDevice';

//学科管理
import Subject from '../../components/system/subjects/Subject';

//帐号管理
import Account from "../../components/system/account/AccountList";
import AddAccount from "../../components/system/account/AddAccount";
import EditAddAccount from "../../components/system/account/EditAccount";

const analysis = [
    {
        path: '/app/authority/roles',
        component: Form
    },
    {
        path: '/app/authority/device',
        component: DeviceManagement
    },
    {
        path: '/app/authority/device/add',
        component: AddDevice
    },
    {
        path: '/app/authority/device/edit/:id',
        component: EditDevice
    },
    {
        path: '/app/authority/subject',
        component: Subject
    },
    {
        path: '/app/authority/accounts',
        component: Account
    },
    {
        path: '/app/authority/accounts/add',
        component: AddAccount
    },
    {
        path: '/app/authority/accounts/edit/:id',
        component: EditAddAccount
    },
    {
        path: '/app/authority/roles/add',
        component: AddRole
    },
    {
        path: '/app/authority/roles/:id',
        component: EditRole
    },
    {
        path: '/app/authority/roles/copy/:id',
        component: CopyRole
    },
    {
        path: '/app/authority/market',
        component: Market
    }
];

export default analysis;
