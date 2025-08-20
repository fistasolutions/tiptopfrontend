import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface Objection {
  id: string;
  customerName: string;
  product: string;
  objectionRaised: string;
  status: 'Scheduled' | 'Ongoing' | 'Completed';
  result: 'Won' | 'Lost' | '-';
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
  userProductPersonas: any;
}

const ObjectionHandling = ({ calls, userProductPersonas }: TabProps) => {
  console.log(userProductPersonas, 'userProductPersonas');
  // State for filter values
  const [dateFilter, setDateFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [objectionTypeFilter, setObjectionTypeFilter] = useState('');
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);

  const openTranscriptModal = (call: Call) => {
    setSelectedCall(call);
    setIsTranscriptModalOpen(true);
  };

  // Filter calls based on selected date and agent
  const filteredCalls = useMemo(() => {
    let filtered = calls;

    // Apply date filter
    if (dateFilter) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const last7Days = new Date(today);
      last7Days.setDate(last7Days.getDate() - 7);
      const last30Days = new Date(today);
      last30Days.setDate(last30Days.getDate() - 30);

      filtered = filtered.filter(call => {
        const callDate = new Date(call.created_at);
        switch (dateFilter) {
          case 'today':
            return callDate >= today;
          case 'yesterday':
            return callDate >= yesterday && callDate < today;
          case 'last7days':
            return callDate >= last7Days;
          case 'last30days':
            return callDate >= last30Days;
          default:
            return true;
        }
      });
    }

    // Apply agent filter
    if (agentFilter) {
      filtered = filtered.filter(call => call.agent_name === agentFilter);
    }

    return filtered;
  }, [calls, dateFilter, agentFilter]);

  // Get the appropriate status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'badge-outline-secondary';
      case 'Ongoing': return 'badge-outline-warning';
      case 'Completed': return 'badge-outline-success';
      default: return 'badge-outline-info';
    }
  };

  // Get the appropriate result badge class
  const getResultBadgeClass = (result: string) => {
    switch (result) {
      case 'Won': return 'badge-outline-success';
      case 'Lost': return 'badge-outline-danger';
      default: return 'badge-outline-secondary';
    }
  };

  // Get the appropriate action buttons based on status
  const getActionButtons = (status: string, call: Call) => {
    switch (status) {
      case 'Scheduled':
        return (
          <>
            <button type="button" className="btn btn-sm btn-outline-primary">View Agenda</button>
          </>
        );
      case 'Ongoing':
        return (
          <>
            <button type="button" className="btn btn-sm btn-outline-success">Join</button>
            <button type="button" className="btn btn-sm btn-outline-info">View</button>
          </>
        );
      case 'Completed':
        return (
          <>
            <button type="button" className="btn btn-sm btn-outline-info" onClick={() => openTranscriptModal(call)}>View</button>
          </>
        );
      default:
        return (
          <button type="button" className="btn btn-sm btn-outline-info" onClick={() => openTranscriptModal(call)}>View</button>
        );
    }
  };

  return (
    <div className="panel mt-5 overflow-hidden border-0 p-0">
      <div className="flex justify-between items-center p-5 border-b border-gray-200">
        <h2 className="text-2xl font-bold">Objection Handling Calls</h2>
        <div className="flex gap-4">
          <button type="button" className="btn btn-primary">
            New Objection Call
          </button>
          <div className="flex gap-2">
            <div>
              <select
                className="form-select"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="">Date</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
              </select>
            </div>
            <div>
              <select
                className="form-select"
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
              >
                <option value="">Agent</option>
                {userProductPersonas.map((persona: any) => (
                  <option key={persona.id} value={persona.id}>{persona.persona_name}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="form-select"
                value={objectionTypeFilter}
                onChange={(e) => setObjectionTypeFilter(e.target.value)}
              >
                <option value="">Objection Type</option>
                <option value="price">Price</option>
                <option value="features">Features</option>
                <option value="trust">Trust</option>
                <option value="timing">Timing</option>
                <option value="competition">Competition</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5 px-5 pt-5">
        <div className="flex items-center gap-4">
          <div className="badge badge-outline-primary p-2 flex items-center gap-1">
            <span className="font-semibold">Top Objections:</span> Price (40%)
          </div>
          <div className="badge badge-outline-primary p-2 flex items-center gap-1">
            Features (30%)
          </div>
          <div className="badge badge-outline-primary p-2 flex items-center gap-1">
            Timing (20%)
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table-striped table-hover">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Product</th>
              <th>Objection Raised</th>
              <th>Status</th>
              <th>Result</th>
              <th className="!text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCalls.map((call) => (
              <tr key={call.id} className={"Won" === 'Won' ? 'bg-success/5' : ''}>
                <td>
                  <div className="flex items-center">
                    <span className="whitespace-nowrap">{call.agent_name}</span>
                  </div>
                </td>
                <td>{call.product_name}</td>
                <td>
                  <div className="flex items-center gap-1">
                    <span className="text-danger-500">🚫</span>
                    <span className="font-semibold">Not Interested</span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${getStatusBadgeClass("Won")}`}>
                    Won
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    {"Won" === 'Won' && <span>✅</span>}
                    <span className={`badge ${getResultBadgeClass("Won")}`}>
                      {"Won"}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-center gap-2">
                    {getActionButtons("Completed", call)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default ObjectionHandling;
