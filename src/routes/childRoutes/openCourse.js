import OpenCourseInfo from "../../components/openClass/CourseHeader";
import AddOpenCourse from "../../components/openClass/AddOpenCourse";
import CourseList from "../../components/openClass/Form";

const openCourse = [
    {
        path: '/app/course/list',
        component: CourseList,
    },
    {
        path: '/app/course/add',
        component: AddOpenCourse,
    },
    {
        path: '/app/course/:id',
        component: OpenCourseInfo,
    }
];

export default openCourse;
