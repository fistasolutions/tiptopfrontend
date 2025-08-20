import { FC, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface SummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    customerName: string;
    product: string;
    dealValue: string;
    closingResult: 'Closed-Won' | 'Closed-Lost' | '';
}

const SummaryModal: FC<SummaryModalProps> = ({ isOpen, onClose, customerName, product, dealValue, closingResult }) => {
    // Sample data - in a real app, this would come from an API
    const summaryData = {
        customerInfo: {
            name: customerName,
            email: 'customer@example.com',
            phone: '+1 (555) 123-4567',
        },
        productDetails: {
            name: product,
            basePrice: dealValue,
            finalPrice: closingResult === 'Closed-Won' ? dealValue : '0',
        },
        negotiations: [
            {
                id: 1,
                note: 'Customer requested 10% discount',
                accepted: true,
            },
            {
                id: 2,
                note: 'Offered 1-month free support',
                accepted: true,
            },
        ],
        decision: closingResult === 'Closed-Won' ? 'Accepted' : 'Declined',
        aiNotes: [
            'Customer was concerned about implementation timeline',
            'Emphasized 24/7 customer support as a key benefit',
            'Customer requested 1-month free trial',
        ],
        upsellOpportunities: [
            'Premium Support Package',
            'Extended Warranty',
            'Training Sessions',
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
                                    Call Summary: {customerName}
                                </Dialog.Title>
                                
                                <div className="mt-2">
                                    {/* Customer Info Section */}
                                    <div className="mb-5">
                                        <h4 className="mb-2 text-lg font-semibold">Customer Information</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                                                <p>{summaryData.customerInfo.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                                <p>{summaryData.customerInfo.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                                                <p>{summaryData.customerInfo.phone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Details Section */}
                                    <div className="mb-5">
                                        <h4 className="mb-2 text-lg font-semibold">Product Details</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Product</p>
                                                <p>{summaryData.productDetails.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Base Price</p>
                                                <p>{summaryData.productDetails.basePrice}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Final Price</p>
                                                <p className={closingResult === 'Closed-Won' ? 'text-success' : 'text-danger'}>
                                                    {summaryData.productDetails.finalPrice}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Negotiations Section */}
                                    <div className="mb-5">
                                        <h4 className="mb-2 text-lg font-semibold">Final Negotiations</h4>
                                        <ul className="list-inside list-disc space-y-1">
                                            {summaryData.negotiations.map((item) => (
                                                <li key={item.id} className="text-sm">
                                                    {item.note}
                                                    {item.accepted && <span className="ml-2 text-success">✓</span>}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Customer Decision Section */}
                                    <div className="mb-5">
                                        <h4 className="mb-2 text-lg font-semibold">Customer Decision</h4>
                                        <div className="flex items-center gap-2">
                                            {closingResult === 'Closed-Won' ? (
                                                <>
                                                    <span className="text-success">✅</span>
                                                    <span className="badge badge-outline-success">Accepted</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-danger">❌</span>
                                                    <span className="badge badge-outline-danger">Declined</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* AI-Generated Notes Section */}
                                    <div className="mb-5">
                                        <h4 className="mb-2 text-lg font-semibold">AI-Generated Closing Notes</h4>
                                        <ul className="list-inside list-disc space-y-1">
                                            {summaryData.aiNotes.map((note, index) => (
                                                <li key={index} className="text-sm">{note}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Upsell Opportunities Section */}
                                    {closingResult === 'Closed-Won' && (
                                        <div className="mb-5">
                                            <h4 className="mb-2 text-lg font-semibold">Future Upsell Opportunities</h4>
                                            <ul className="list-inside list-disc space-y-1">
                                                {summaryData.upsellOpportunities.map((opportunity, index) => (
                                                    <li key={index} className="text-sm">{opportunity}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={onClose}
                                    >
                                        Close
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

export default SummaryModal; 