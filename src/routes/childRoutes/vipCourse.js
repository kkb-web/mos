import VipCourseClass from "../../components/vipClass/classList/ClassList";
import VipCourseManage from "../../components/vipClass/vipManage/CourseHeader";
import AddClass from "../../components/vipClass/vipManage/class/AddClass"
import EditClass from "../../components/vipClass/vipManage/class/EditClass"
import VipCourseList from '../../components/vipClass/vipManage/VipCourseList'
import AddVipCourse from '../../components/vipClass/vipManage/AddVipCourse'
import AddVipChannel from '../../components/vipClass/vipManage/addChannel/AddVipChannel'

const vipCourse = [
    {
        path: '/app/vipcourse/list',
        component: VipCourseList,
    },
    {
        path: '/app/vipcourse/add',
        component: AddVipCourse,
    },
    {
        path: '/app/vipcourse/class',
        component: VipCourseClass,
    },
    {
        path: '/app/vipcourse/:id',
        component: VipCourseManage,
    },
    {
        path: '/app/vipcourse/:courseid/add',
        component: AddClass,
    },
    {
        path: '/app/vipcourse/:courseid/channel',
        component: AddVipChannel,
    },
    {
        path: '/app/vipcourse/:courseid/:id',
        component: EditClass,
    },
];

export default vipCourse;
