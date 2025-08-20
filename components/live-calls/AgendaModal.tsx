import { FC, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface AgendaModalProps {
    isOpen: boolean;
    onClose: () => void;
    customerName: string;
    product: string;
    dealValue: string;
}

const AgendaModal: FC<AgendaModalProps> = ({ isOpen, onClose, customerName, product, dealValue }) => {
    // Sample data - in a real app, this would come from an API
    const agendaData = {
        customerInfo: {
            name: customerName,
            email: 'customer@example.com',
            phone: '+1 (555) 123-4567',
        },
        productInfo: {
            name: product,
            basePrice: dealValue,
        },
        pricingDetails: [
            {
                id: 1,
                item: 'Base Product',
                price: dealValue,
            },
            {
                id: 2,
                item: 'Premium Support',
                price: '$99/year',
                isOptional: true,
            },
            {
                id: 3,
                item: 'Extended Warranty',
                price: '$199',
                isOptional: true,
            },
        ],
        customOffers: [
            {
                id: 1,
                description: '10% discount for first-time customers',
                isAvailable: true,
            },
            {
                id: 2,
                description: '1-month free trial',
                isAvailable: true,
            },
        ],
        contractReady: true,
        customerConcerns: [
            {
                id: 1,
                concern: 'Price seems high compared to competitors',
                notes: 'Prepare competitive analysis to show superior value',
            },
            {
                id: 2,
                concern: 'Implementation timeline',
                notes: 'Emphasize quick onboarding process and support team',
            },
        ],
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-dark/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-black">
                                <Dialog.Title as="h3" className="mb-5 text-xl font-medium leading-6 text-gray-900 dark:text-white">
                                    Call Agenda: {customerName}
                                </Dialog.Title>
                                
                                <div className="mt-2">
                                    {/* Pricing Details Section */}
                                    <div className="mb-5">
                                        <h4 className="mb-2 text-lg font-semibold">Pricing Details</h4>
                                        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                                            <table className="w-full table-auto">
                                                <thead className="bg-gray-50 dark:bg-gray-800">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Item</th>
                                                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                    {agendaData.pricingDetails.map((item) => (
                                                        <tr key={item.id} className="bg-white dark:bg-gray-900">
                                                            <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                                                {item.item}
                                                                {item.isOptional && (
                                                                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(Optional)</span>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-2 text-right text-sm text-gray-900 dark:text-white">{item.price}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Custom Offers Section */}
                                    <div className="mb-5">
                                        <h4 className="mb-2 text-lg font-semibold">Custom Offers</h4>
                                        <ul className="list-inside list-disc space-y-1">
                                            {agendaData.customOffers.map((offer) => (
                                                <li key={offer.id} className="text-sm">
                                                    {offer.description}
                                                    {offer.isAvailable && <span className="ml-2 text-success">✓ Available</span>}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Contract Status Section */}
                                    <div className="mb-5">
                                        <h4 className="mb-2 text-lg font-semibold">Contract Status</h4>
                                        <div className="flex items-center gap-2">
                                            {agendaData.contractReady ? (
                                                <>
                                                    <span className="text-success">✅</span>
                                                    <span className="badge badge-outline-success">Ready for Signature</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-warning">⚠️</span>
                                                    <span className="badge badge-outline-warning">Pending Legal Review</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Customer Concerns Section */}
                                    <div className="mb-5">
                                        <h4 className="mb-2 text-lg font-semibold">Anticipated Customer Concerns</h4>
                                        <div className="space-y-3">
                                            {agendaData.customerConcerns.map((concern) => (
                                                <div key={concern.id} className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                                                    <p className="font-medium">🚫 {concern.concern}</p>
                                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                        <span className="font-medium">Handling strategy:</span> {concern.notes}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={onClose}
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                    >
                                        <svg className="h-5 w-5 ltr:mr-2 rtl:ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none">
                                            <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                                            <path d="M14 18a4 4 0 0 0 0-8 4 4 0 0 0 0 8z"></path>
                                            <path d="M7 16.2a5 5 0 0 1 10 0"></path>
                                            <path d="M7 16.2a5 5 0 0 0 10 0"></path>
                                        </svg>
                                        Schedule Call
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AgendaModal; 