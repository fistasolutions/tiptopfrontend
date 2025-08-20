import React, { useState } from 'react';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface CallData {
    transcript?: string;
    target_audience?: string;
    key_features_discussed?: string[];
    call_settings?: {
        duration: number;
        warmupTime: number;
        maxAttempts: number;
    };
    call_duration?: number;
    notes?: string;
    outcome?: string;
    metadata?: {
        call_quality: string;
        customer_satisfaction: number;
    };
}

interface Call {
    id: number;
    product_id: number;
    user_id: number;
    call_type: string;
    agent_name: string;
    call_data: CallData;
    created_at: string;
    product_name: string;
}

interface TabProps {
    calls: Call[];
}

const DiscoveryTab: React.FC<TabProps> = ({ calls }) => {
    const [selectedCall, setSelectedCall] = useState<Call | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);

    const openDetailsModal = (call: Call) => {
        setSelectedCall(call);
        setIsDetailsModalOpen(true);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getStatusBadgeClass = (status: string) => {
        if (status === 'Completed') {
            return 'badge-outline-success';
        } else if (status === 'Failed') {
            return 'badge-outline-danger';
        }
        return 'badge-outline-info';
    };

    const getStatusText = (status: string) => {
        if (status === 'Completed') {
            return 'Completed';
        } else if (status === 'Failed') {
            return 'Failed';
        }
        return 'In Progress';
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-5">
                <h2 className="text-2xl font-bold">Discovery Calls</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Track and manage your discovery calls with potential customers</p>
            </div>

            {/* Table */}
            <div className="panel mt-5 overflow-hidden border-0 p-0">
                <div className="table-responsive">
                    <table className="table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Product</th>
                                <th>Target Audience & Product Interest</th>
                                <th>Duration</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th className="!text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {calls.map((call) => {
                                return(
                                <tr key={call.id}>
                                    <td>{call.agent_name}</td>
                                    <td>{call.product_name}</td>
                                    <td>{call.call_data.target_audience || 'N/A'}</td>
                                    <td>{call.call_data?.call_duration ? `${call.call_data?.call_duration} seconds` : 'N/A'}</td>
                                    <td>{formatDate(call.created_at)}</td>
                                    <td>
                                        <span className={`badge ${getStatusBadgeClass("Completed")}`}>
                                            {getStatusText("Completed")}
                                        </span>
                                    </td>   
                                    <td>
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => openDetailsModal(call)}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Details Modal */}
            <Transition appear show={isDetailsModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsDetailsModalOpen(false)}>
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
                        <div className="flex max-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
                                    {selectedCall && (
                                        <>
                                            <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                                                Call Details
                                            </Dialog.Title>
                                            <div className="mt-4 space-y-4">
                                                <div>
                                                    <h4 className="font-semibold">Agent</h4>
                                                    <p>{selectedCall.agent_name}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">Target Audience</h4>
                                                    <p>{selectedCall.call_data.target_audience || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">Key Features Discussed</h4>
                                                    <ul className="list-disc list-inside">
                                                        {selectedCall.call_data.key_features_discussed?.map((feature, index) => (
                                                            <li key={index}>{feature}</li>
                                                        )) || <li>No features recorded</li>}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">Call Quality</h4>
                                                    <p>{selectedCall.call_data.metadata?.call_quality || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">Notes</h4>
                                                    <p>{selectedCall.call_data.notes || 'No notes available'}</p>
                                                </div>
                                                {selectedCall.call_data.transcript && (
                                                    <div className="mt-4">
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary"
                                                            onClick={() => setIsTranscriptModalOpen(true)}
                                                        >
                                                            View Transcript
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-6 flex justify-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger"
                                                    onClick={() => setIsDetailsModalOpen(false)}
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Transcript Modal */}
            <Transition appear show={isTranscriptModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsTranscriptModalOpen(false)}>
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
                        <div className="flex max-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 mb-4">
                                        Call Transcript
                                    </Dialog.Title>
                                    <div className="mt-4">
                                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg max-h-[60vh] overflow-y-auto">
                                            <pre className="whitespace-pre-wrap font-mono text-sm">
                                                {selectedCall?.call_data.transcript || 'No transcript available'}
                                            </pre>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            onClick={() => setIsTranscriptModalOpen(false)}
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
        </div>
    );
};

export default DiscoveryTab;
