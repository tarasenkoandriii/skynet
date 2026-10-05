import {paymentGate} from '@/lib/gates';
import {messages} from '@/lib/i18n';
export function PaymentGate({notice=messages('uk').paymentNotice}:{notice?:string}){paymentGate();return <div className="notice">{notice}</div>}
