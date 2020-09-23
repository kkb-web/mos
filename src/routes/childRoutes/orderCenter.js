import Order from '../../components/orderCenter/order/Index';
import RefundRecord from '../../components/orderCenter/refundRecord/Index';

const orderCenter = [
    {
        path: '/app/ordercenter/all',
        component: Order,
    },
    {
        path: '/app/ordercenter/refund',
        component: RefundRecord,
    }
];

export default orderCenter;
