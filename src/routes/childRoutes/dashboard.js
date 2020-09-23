import Workplace from "../../components/dashboard/Workplace";
import Monitor from "../../components/dashboard/Monitor";
import Analysis from "../../components/dashboard/Analysis";

import Charts from "../../components/charts/index";

const dashboard = [
    {
        path: '/app/dashboard/analysis',
        component: Analysis
    },
    {
        path: '/app/dashboard/monitor',
        component: Monitor
    },
    {
        path: '/app/dashboard/workplace',
        component: Workplace
    },
    {
        path: '/app/dashboard/test',
        component: Charts
    }
];

export default dashboard;
