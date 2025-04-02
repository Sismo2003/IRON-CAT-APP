import React, {useState} from 'react';
import { SubscriptionChart } from './Charts';

const Subscription = () => {
  const [TicketType, setTicketType] = useState('sale')
  return (
        <React.Fragment>
            <div className="col-span-12 lg:col-span-6 order-[14] 2xl:order-1 card 2xl:col-span-3">
                <div className="card-body">
                  {TicketType === 'sale' ? (
                    <div className="flex w-full items-center justify-between mb-4">
                      <h6 className="mb-3 text-15 font-medium">Compra de productos  </h6>
                      <button
                        onClick={() => setTicketType('shop')}
                        type="button"
                        className="bg-white border-dashed text-sky-500 btn border-sky-500 hover:text-sky-500 hover:bg-sky-50 hover:border-sky-600 focus:text-sky-600 focus:bg-sky-50 focus:border-sky-600 active:text-sky-600 active:bg-sky-50 active:border-sky-600 dark:bg-zink-700 dark:ring-sky-400/20 dark:hover:bg-sky-800/20 dark:focus:bg-sky-800/20 dark:active:bg-sky-800/20">
                        <i className="align-baseline ltr:pr-1 rtl:pl-1 ri-refresh-line"></i>
                        Compra
                      </button>
                    </div>
                  ) : (
                    <div className="flex w-full items-center justify-between mb-4">
                      <h6 className="mb-3 text-15 font-medium">Venta de productos   </h6>
                      <button
                        onClick={() => setTicketType('sale')}
                        type="button"
                        className="bg-white border-dashed text-sky-500 btn border-sky-500 hover:text-sky-500 hover:bg-sky-50 hover:border-sky-600 focus:text-sky-600 focus:bg-sky-50 focus:border-sky-600 active:text-sky-600 active:bg-sky-50 active:border-sky-600 dark:bg-zink-700 dark:ring-sky-400/20 dark:hover:bg-sky-800/20 dark:focus:bg-sky-800/20 dark:active:bg-sky-800/20">
                        <i className="align-baseline ltr:pr-1 rtl:pl-1 ri-refresh-line"></i>
                        Venta
                      </button>
                    </div>
                  )}
                    <h6 className="mb-3 text-15">Subscription Distribution</h6>
                    <SubscriptionChart chartId="subscriptionDistribution" />
                </div>
              
            </div>
        </React.Fragment>
    );
};

export default Subscription;
