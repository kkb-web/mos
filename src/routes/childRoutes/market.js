import Qrcode from "../../components/qrcode/media/Form";
import Upload from "../../components/qrcode/media/Upload";
import Edit from "../../components/qrcode/media/Edit";
import Resources from "../../components/qrcode/resources";

//投放列表 by zqy
import LaunchList from "../../components/qrcode/launch/LaunchList";
import LaunchAdd from "../../components/qrcode/launch/AddLaunch";
//媒体信息 by zljiang
import MediaInfo from "../../components/qrcode/launch/LaunchMediaInfo";
//媒体管理 by zljiang
import Medias from "../../components/qrcode/medias/Media";
//成单列表 by shilun
import Orders from "../../components/qrcode/order";

const market = [
    {
        path: '/app/qrcode/list',
        component: Qrcode
    },
    {
        path: '/app/qrcode/upload',
        component: Upload
    },
    {
        path: '/app/qrcode/edit/:id',
        component: Edit
    },
    {
        path: '/app/qrcode/resources',
        component: Resources
    },
    {
        path: '/app/qrcode/launch',
        component: LaunchList
    },
    {
        path: '/app/qrcode/launch/add',
        component: LaunchAdd
    },
    {
        path: '/app/qrcode/media',
        component: Medias
    },
    {
        path: '/app/qrcode/order',
        component: Orders
    },
    {
        path: '/app/qrcode/:name',
        component: MediaInfo
    }
];

export default market;
