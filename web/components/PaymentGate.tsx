import {paymentGate} from '@/lib/gates';
export function PaymentGate(){paymentGate();return <div className="notice">Онлайн-внесок та QR-оплата ще не активовані. Платіжні реквізити не підміняються резервними або особистими рахунками.</div>}
