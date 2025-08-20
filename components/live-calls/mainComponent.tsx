'use client';
import React, { useState, Suspense, lazy, ErrorInfo } from 'react';
import { Product, TargetAudience } from '@/types/product';
import { VoiceProvider } from '@/lib/voice/VoiceProvider';
import { useQuery, UseQueryOptions, useQueryClient } from '@tanstack/react-query';
import { getCalls } from '@/services/callsService';
import { getUserIdFromToken } from '@/utils/auth';
import { toast } from 'react-hot-toast';
import { getProductPersonas, getUserProductPersonas } from '@/services/productPersonaService';

import CallPurposeSelector from './CallPurposeSelector';
import HeaderSection from './HeaderSection';
import StatisticsCards from './StatisticsCards';
import FilterButtons from './FilterButtons';

// Dynamic imports for tab components
const DemoTab = lazy(() => import('./DemoTab')) as React.LazyExoticComponent<React.FC<TabProps>>;
const ObjectionHandlingTab = lazy(() => import('./ObjectionHandling')) as React.LazyExoticComponent<React.FC<TabProps>>;
const ClosingTab = lazy(() => import('./ClossingTab')) as React.LazyExoticComponent<React.FC<TabProps>>;
const DiscoveryTab = lazy(() => import('./DiscoveryTab')) as React.LazyExoticComponent<React.FC<TabProps>>;

interface Focus {
    id: string;
    name: string;
}

interface CallPurpose {
    product: Product | null;
    focus: Focus | null;
    targetAudience: TargetAudience | null;
}

interface PracticeTip {
    id: string;
    icon: string;
    text: string;
}

const practiceTips: PracticeTip[] = [
    {
        id: '1',
        icon: '🎧',
        text: 'Find a quiet environment for best call quality',
    },
    {
        id: '2',
        icon: '📝',
        text: 'Review product details before starting a practice call',
    },
    {
        id: '3',
        icon: '💬',
        text: 'Respond to AI feedback after each session',
    },
];

// Add interfaces for call data
interface CallData {
    transcript?: string;
    target_audience?: string;
    key_features_discussed?: string[];
    call_settings?: {
        duration: number;
        warmupTime: number;
        maxAttempts: number;
        call_duration?: number;
    };
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

interface ProductPersona {
    persona_name: string;
    strategy: string[];
    key_features: string[];
}

interface TabProps {
    calls: Call[];
    userProductPersonas?: any[];
}

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-red-50 rounded-lg">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 mb-4">{this.state.error?.message || 'An unexpected error occurred'}</p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Try again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

// Loading Component
const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
);

const MainComponent: React.FC = () => {
    // State management
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [callPurpose, setCallPurpose] = useState<CallPurpose>({
        product: null,
        focus: null,
        targetAudience: null,
    });
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const [showFocusDropdown, setShowFocusDropdown] = useState(false);
    const [showTargetAudienceDropdown, setShowTargetAudienceDropdown] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [productPersonas, setProductPersonas] = useState({});
    const MAX_RETRIES = 3;

    const userId = getUserIdFromToken();
    const queryClient = useQueryClient();

    // Enhanced error handling for API calls
    const { data: calls = [], isLoading: isCallsLoading, error: callsError, refetch } = useQuery<Call[], Error>({
        queryKey: ['calls', userId],
        queryFn: async () => {
            try {
                if (!userId) {
                    throw new Error('User not authenticated');
                }
                const response = await getCalls(userId);
                return response;
            } catch (error) {
                console.error('Error fetching calls:', error);
                throw error;
            }
        },
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
            if (failureCount < MAX_RETRIES) {
                setRetryCount(failureCount);
                return true;
            }
            return false;
        }
    });

    // Add user product personas query
    const { data: userProductPersonas = [], isLoading: isUserProductPersonasLoading, error: userProductPersonasError } = useQuery({
        queryKey: ['userProductPersonas', userId],
        queryFn: async () => {
            try {
                if (!userId) {
                    throw new Error('User not authenticated');
                }
                const response = await getUserProductPersonas(userId);
                return response;
            } catch (error) {
                console.error('Error fetching user product personas:', error);
                throw error;
            }
        },
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
            if (failureCount < MAX_RETRIES) {
                setRetryCount(failureCount);
                return true;
            }
            return false;
        }
    });

    // Add effect to log user product personas when they cha
    // Handle API errors
    React.useEffect(() => {
        if (callsError) {
            toast.error(callsError.message || 'Failed to fetch calls');
        }
        if (userProductPersonasError) {
            toast.error(userProductPersonasError.message || 'Failed to fetch user product personas');
        }
    }, [callsError, userProductPersonasError]);

    // Filter calls by type with proper type checking
    const demoCalls = (calls || []).filter((call: Call) => call.call_type === 'Demo');
    const discoveryCalls = (calls || []).filter((call: Call) => call.call_type === 'Discovery');
    const objectionHandlingCalls = (calls || []).filter((call: Call) => call.call_type === 'Objection Handling');
    const closingCalls = (calls || []).filter((call: Call) => call.call_type === 'Closing');
    const currentUserSelectedProductCalls=(calls|| []).filter((call: Call) => call.product_id == callPurpose.product?.id);
    const statisticsData = [
        {
            title: 'Pending',
            value: 0,
            color: '#1A1A2E',
            icon: null,
        },
        {
            title: 'Active',
            value: (calls || []).filter((call: Call) => call.call_type === 'Demo').length,
            color: '#10B981',
            icon: null,
        },
        {
            title: 'Completed',
            value: (calls || []).filter((call: Call) => call.call_type === 'sales').length,
            color: 'blue',
            icon: null,
        },
        {
            title: 'Failed',
            value: 0,
            color: 'red',
            icon: null,
        },
    ];

    // Call types for the tabs
    const callTypes = ['Demo', 'Discovery', 'Objection Handling', 'Closing'];

    // Check if call is fully configured
    const isFullyConfigured = callPurpose.product && callPurpose.focus && callPurpose.targetAudience;

    // Handlers
    const handleProductSelect = async (product: Product) => {
        setCallPurpose((prev) => ({ ...prev, product }));
        setShowProductDropdown(false);
        console.log("product",product);
        try {
            if (product.id) {
                const personas = await getProductPersonas(product.id);
                setProductPersonas(personas);
            }
        } catch (error) {
            console.error('Error fetching product personas:', error);
            toast.error('Failed to fetch product personas');
        }
    };

    const handleFocusSelect = (focus: Focus) => {
        setCallPurpose((prev) => ({ ...prev, focus }));
        setShowFocusDropdown(false);
    };

    const handleTargetAudienceSelect = (targetAudience: TargetAudience) => {
        setCallPurpose((prev) => ({ ...prev, targetAudience }));
        setShowTargetAudienceDropdown(false);
    };


    const headerData = {
        title: 'Live Practice Calls',
        description: 'Practice and improve your sales skills with AI coaching',
        buttons: [
            {
                label: 'Call History',
                onClick: () => {
                    // Handle call history click
                },
                variant: 'secondary' as const,
            },
            {
                label: 'New Practice Call',
                onClick: () => {
                    // Handle new practice call click
                },
                variant: 'primary' as const,
            },
        ],
    };

    const filterButtons = [
        { label: 'All Types', value: null },
        { label: 'Demo', value: 'Demo' },
        { label: 'Discovery', value: 'Discovery' },
        { label: 'Objection Handling', value: 'Objection Handling' },
        { label: 'Closing', value: 'Closing' },
    ];
  
    
    if (isCallsLoading || isUserProductPersonasLoading) {
        return <LoadingSpinner />;
    }

    if (callsError || userProductPersonasError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-red-50 rounded-lg">
                <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Data</h2>
                <p className="text-gray-600 mb-4">
                    {callsError?.message || userProductPersonasError?.message || 'Failed to load data'}
                </p>
                <button
                    onClick={() => {
                        refetch();
                        // Refetch user product personas
                        queryClient.invalidateQueries({ queryKey: ['userProductPersonas'] });
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    disabled={retryCount >= MAX_RETRIES}
                >
                    {retryCount >= MAX_RETRIES ? 'Max retries reached' : 'Try again'}
                </button>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            {callPurpose.product ? (
                <VoiceProvider product={callPurpose.product} callPurpose={callPurpose.focus?.name || "Demo"} targetAudienceArea={callPurpose.targetAudience?.name || "Not specified"}>
                    <div className="flex flex-col gap-6">
                        <div className="flex-1">
                            <HeaderSection {...headerData} />
                            <StatisticsCards stats={statisticsData} />
                            <FilterButtons activeTab={activeTab} setActiveTab={setActiveTab} buttons={filterButtons} />
                            {activeTab === null && (
                                <div className="mt-12 relative mx-auto max-w-[1550px]">
                                    <div className="relative flex h-auto flex-col items-center justify-between rounded-2xl dark:bg-slate-800 backdrop-blur-sm">
                                        <div className="flex h-full w-full items-center justify-center gap-2">
                                            <CallPurposeSelector
                                                personas={productPersonas}
                                                callPurpose={callPurpose}
                                                isRecording={isRecording}
                                                setIsRecording={setIsRecording}
                                                showProductDropdown={showProductDropdown}
                                                showFocusDropdown={showFocusDropdown}
                                                showTargetAudienceDropdown={showTargetAudienceDropdown}
                                                onProductDropdownToggle={() => setShowProductDropdown(!showProductDropdown)}
                                                onFocusDropdownToggle={() => setShowFocusDropdown(!showFocusDropdown)}
                                                onTargetAudienceDropdownToggle={() => setShowTargetAudienceDropdown(!showTargetAudienceDropdown)}
                                                onProductSelect={handleProductSelect}
                                                onFocusSelect={handleFocusSelect}
                                                onTargetAudienceSelect={handleTargetAudienceSelect}
                                                currentUserSelectedProductCalls={currentUserSelectedProductCalls}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <Suspense fallback={<LoadingSpinner />}>
                                {activeTab === 'Demo' && <ErrorBoundary><DemoTab calls={demoCalls} userProductPersonas={userProductPersonas} /></ErrorBoundary>}
                                {activeTab === 'Discovery' && <ErrorBoundary><DiscoveryTab calls={discoveryCalls} userProductPersonas={userProductPersonas} /></ErrorBoundary>}
                                {activeTab === 'Objection Handling' && <ErrorBoundary><ObjectionHandlingTab calls={objectionHandlingCalls} userProductPersonas={userProductPersonas} /></ErrorBoundary>}
                                {activeTab === 'Closing' && <ErrorBoundary><ClosingTab calls={closingCalls} userProductPersonas={userProductPersonas} /></ErrorBoundary>}
                            </Suspense>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-between mt-12">
                            <div className="col-span-2">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">Recent Practice Calls</h2>
                                    <a href="#" className="text-sm text-blue-500 hover:text-blue-600">
                                        View All
                                    </a>
                                </div>
                                <div className="flex gap-6">
                                    <div className="flex-1">
                                        <div className="flex min-h-[200px] items-center justify-center rounded-lg p-6">
                                            <span className="text-slate-500">No practice calls yet</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-[320px]">
                                <div className="rounded-lg p-6">
                                    <h2 className="mb-8 text-lg font-bold">Practice Tips</h2>
                                    <div className="space-y-4">
                                        {practiceTips.map((tip) => (
                                            <div key={tip.id} className="flex items-start gap-3 border-b border-slate-200 pb-4">
                                                <span className="text-2xl" role="img" aria-label={tip.text}>
                                                    {tip.icon}
                                                </span>
                                                <p className="text-sm text-slate-600">{tip.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </VoiceProvider>
            ) : (
                <div className="flex flex-col gap-6">
                    <div className="flex-1">
                        <HeaderSection {...headerData} />
                        <StatisticsCards stats={statisticsData} />
                        <FilterButtons activeTab={activeTab} setActiveTab={setActiveTab} buttons={filterButtons} />
                        {activeTab === null && (
                            <div className="mt-12 relative mx-auto max-w-[1550px]">
                                <div className="relative flex h-auto flex-col items-center justify-between rounded-2xl dark:bg-slate-800 backdrop-blur-sm">
                                    <div className="flex h-full w-full items-center justify-center gap-2">
                                        <CallPurposeSelector
                                            personas={productPersonas}
                                            callPurpose={callPurpose}
                                            isRecording={isRecording}
                                            setIsRecording={setIsRecording}
                                            showProductDropdown={showProductDropdown}
                                            showFocusDropdown={showFocusDropdown}
                                            showTargetAudienceDropdown={showTargetAudienceDropdown}
                                            onProductDropdownToggle={() => setShowProductDropdown(!showProductDropdown)}
                                            onFocusDropdownToggle={() => setShowFocusDropdown(!showFocusDropdown)}
                                            onTargetAudienceDropdownToggle={() => setShowTargetAudienceDropdown(!showTargetAudienceDropdown)}
                                            onProductSelect={handleProductSelect}
                                            onFocusSelect={handleFocusSelect}
                                            onTargetAudienceSelect={handleTargetAudienceSelect}
                                            currentUserSelectedProductCalls={currentUserSelectedProductCalls}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        <Suspense fallback={<LoadingSpinner />}>
                            {activeTab === 'Demo' && <ErrorBoundary><DemoTab calls={demoCalls} userProductPersonas={userProductPersonas} /></ErrorBoundary>}
                            {activeTab === 'Discovery' && <ErrorBoundary><DiscoveryTab calls={discoveryCalls} userProductPersonas={userProductPersonas} /></ErrorBoundary>}
                            {activeTab === 'Objection Handling' && <ErrorBoundary><ObjectionHandlingTab calls={objectionHandlingCalls} userProductPersonas={userProductPersonas} /></ErrorBoundary>}
                            {activeTab === 'Closing' && <ErrorBoundary><ClosingTab calls={closingCalls} userProductPersonas={userProductPersonas} /></ErrorBoundary>}
                        </Suspense>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-between mt-12">
                        <div className="col-span-2">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Recent Practice Calls</h2>
                                <a href="#" className="text-sm text-blue-500 hover:text-blue-600">
                                    View All
                                </a>
                            </div>
                            <div className="flex gap-6">
                                <div className="flex-1">
                                    <div className="flex min-h-[200px] items-center justify-center rounded-lg p-6">
                                        <span className="text-slate-500">No practice calls yet</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-[320px]">
                            <div className="rounded-lg p-6">
                                <h2 className="mb-8 text-lg font-bold">Practice Tips</h2>
                                <div className="space-y-4">
                                    {practiceTips.map((tip) => (
                                        <div key={tip.id} className="flex items-start gap-3 border-b border-slate-200 pb-4">
                                            <span className="text-2xl" role="img" aria-label={tip.text}>
                                                {tip.icon}
                                            </span>
                                            <p className="text-sm text-slate-600">{tip.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ErrorBoundary>
    );
};

export default MainComponent;
