import Refund from '../../components/finance/refund/Refund'
import Receables from '../../components/finance/receivables/Index'
import Invoice from '../../components/finance/invoice/Index'
const finance = [
    {
        path: '/app/finance/refund',
        component: Refund
    },
    {
        path: '/app/finance/payment',
        component: Receables
    },
    {
        path: '/app/finance/bill',
        component: Invoice
    }
];

export default finance;