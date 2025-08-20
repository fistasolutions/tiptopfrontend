import { FC, useState, useMemo } from 'react';
import SummaryModal from './SummaryModal';
import AgendaModal from './AgendaModal';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface ClosingCall {
    id: string;
    customerName: string;
    product: string;
    dealValue: string;
    status: 'Scheduled' | 'Ongoing' | 'Completed';
    closingResult: 'Closed-Won' | 'Closed-Lost' | '';
    call_data?: CallData;
}

interface CallData {
    transcript?: string;
    target_audience?: string;
    key_features_discussed?: string[];
    call_settings?: {
        duration: number;
        warmupTime: number;
        maxAttempts: number;
    };
    duration?: number;
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
    userProductPersonas: any
  }

const ClossingTab: FC<TabProps> = ({ calls, userProductPersonas }) => {
    // Filter states
    const [dateFilter, setDateFilter] = useState<string>('');
    const [agentFilter, setAgentFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [resultFilter, setResultFilter] = useState<string>('');

    // Modal states
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    const [isAgendaModalOpen, setIsAgendaModalOpen] = useState(false);
    const [selectedCall, setSelectedCall] = useState<Call | null>(null);
    const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);

    console.log(userProductPersonas, 'userProductPersonas');
    // Helper functions to get appropriate styling classes
    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Scheduled':
                return 'badge-outline-secondary';
            case 'Ongoing':
                return 'badge-outline-warning';
            case 'Completed':
                return 'badge-outline-success';
            default:
                return 'badge-outline-primary';
        }
    };

    const getResultBadgeClass = (result: string) => {
        switch (result) {
            case 'Closed-Won':
                return 'badge-outline-success';
            case 'Closed-Lost':
                return 'badge-outline-danger';
            default:
                return 'badge-outline-secondary';
        }
    };

    // Handlers for action buttons
    const handleViewSummary = (call: Call) => {
        setSelectedCall(call);
        setIsTranscriptModalOpen(true);
    };

    const handleViewAgenda = (call: Call) => {
        setSelectedCall(call);
        setIsAgendaModalOpen(true);
    };

    // Get the appropriate action buttons based on status
    const getActionButtons = (status: string,call:Call) => {
        switch (status) {
            case 'Scheduled':
                return (
                    <button 
                        type="button" 
                        className="btn btn-sm btn-outline-primary"
                        // onClick={() => handleViewAgenda(call)}
                    >
                        View Agenda
                    </button>
                );
            case 'Ongoing':
                return (
                    <>
                        <button type="button" className="btn btn-sm btn-outline-success">Join</button>
                        <button 
                            type="button" 
                            className="btn btn-sm btn-outline-primary"
                            // onClick={() => handleViewAgenda(call)}
                        >
                            View Agenda
                        </button>
                    </>
                );
            case 'Completed':
                return (
                    <>
                        <button 
                            type="button" 
                            className="btn btn-sm btn-outline-info"
                            onClick={() => handleViewSummary(call)}
                        >
                            View Summary
                        </button>
                    </>
                );
            default:
                return (
                    <button type="button" className="btn btn-sm btn-outline-info">View</button>
                );
        }
    };

    // Filter the calls based on date and agent
    const filteredCalls = useMemo(() => {
        return calls.filter(call => {
            const callDate = new Date(call.created_at).toISOString().split('T')[0];
            const matchesDate = !dateFilter || callDate === dateFilter;
            const matchesAgent = !agentFilter || call.agent_name === agentFilter;
            
            return matchesDate && matchesAgent;
        });
    }, [calls, dateFilter, agentFilter]);

    return (
        <div>
            <div className="mb-5 flex flex-col items-start justify-between px-5 pb-6 pt-5 sm:flex-row sm:items-center">
                <h5 className="text-lg font-semibold dark:text-white-light">Closing Calls</h5>
                <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-0">
                    <button type="button" className="btn btn-primary">
                        <svg className="h-5 w-5 ltr:mr-2 rtl:ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        New Closing Call
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-5 grid grid-cols-1 gap-4 px-5 sm:grid-cols-4">
                <div>
                    <label htmlFor="dateFilter" className="mb-1 block text-sm">Date Range</label>
                    <input 
                        id="dateFilter" 
                        type="date" 
                        className="form-input" 
                        value={dateFilter} 
                        onChange={(e) => setDateFilter(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="agentFilter" className="mb-1 block text-sm">Assigned Agent</label>
                    <select 
                        id="agentFilter" 
                        className="form-select" 
                        value={agentFilter} 
                        onChange={(e) => setAgentFilter(e.target.value)}
                    >
                        <option value="">All Agents</option>
                        {userProductPersonas.map((persona: any) => (
                            <option key={persona.id} value={persona.id}>{persona.persona_name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="statusFilter" className="mb-1 block text-sm">Closing Status</label>
                    <select 
                        id="statusFilter" 
                        className="form-select" 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="resultFilter" className="mb-1 block text-sm">Closing Result</label>
                    <select 
                        id="resultFilter" 
                        className="form-select" 
                        value={resultFilter} 
                        onChange={(e) => setResultFilter(e.target.value)}
                    >
                        <option value="">All Results</option>
                        <option value="Closed-Won">Closed-Won</option>
                        <option value="Closed-Lost">Closed-Lost</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="panel mt-5 overflow-hidden border-0 p-0">
                <div className="table-responsive">
                    <table className="table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Product</th>
                                <th>Deal Value</th>
                                <th>Status</th>
                                <th>Closing Result</th>
                                <th className="!text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCalls.map((call) => (
                                <tr key={call.id} className={"Closed-Won" === 'Closed-Won' ? 'bg-success/5': ''}>
                                    <td>
                                        <div className="flex items-center">
                                            <span className="whitespace-nowrap">{call.agent_name}</span>
                                        </div>
                                    </td>
                                    <td>{call.product_name}</td>
                                    <td className="font-semibold text-success">$1200</td>
                                    <td>
                                        <span className={`badge ${getStatusBadgeClass("Completed")}`}>
                                            Completed
                                        </span>
                                    </td>
                                    <td>
                                            <div className="flex items-center gap-1">
                                                {"Closed-Won"=== 'Closed-Won' && <span>✅</span>}
                                        
                                            </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-center gap-2">
                                            {getActionButtons("Completed",call)}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


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
                                                {selectedCall?.call_data?.transcript || 'No transcript available'}
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

export default ClossingTab;
