import SaleDta from "../../components/preSaleData/AddSaleData";
import SaleDtaList from "../../components/preSaleData/PreSaleDataList"
import PreSaleDataHeader from "../../components/preSaleData/PreSaleDataHeader"

const openCourse = [
    {
        path: '/app/presaledata/add',
        component: SaleDta,
    },
    {
        path: '/app/presaledata/list',
        component: SaleDtaList,
    },
    {
        path: '/app/presaledata/:id',
        component: PreSaleDataHeader,
    }
];
export default openCourse;
