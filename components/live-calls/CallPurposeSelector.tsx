"use client"

import type React from "react"
import { Phone } from "lucide-react"
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProducts } from '@/services/productService';
import { getUserIdFromToken } from '@/utils/auth';
import { Product, TargetAudience } from '@/types/product';
import { useVoice } from '@/lib/voice/VoiceProvider';
import { VoiceProvider } from '@/lib/voice/VoiceProvider';
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { toast } from "react-hot-toast";

interface Focus {
  id: string;
  name: string;
}

interface CallPurposeProps {
  product: Product | null;
  focus: Focus | null;
  targetAudience: TargetAudience | null;
}

interface CallPurposeSelectorProps {
  callPurpose: {
    product: Product | null;
    focus: Focus | null;
    targetAudience: TargetAudience | null;
  };
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  showProductDropdown: boolean;
  showFocusDropdown: boolean;
  showTargetAudienceDropdown: boolean;
  onProductDropdownToggle: () => void;
  onFocusDropdownToggle: () => void;
  onTargetAudienceDropdownToggle: () => void;
  onProductSelect: (product: Product) => void;
  onFocusSelect: (focus: Focus) => void;
  onTargetAudienceSelect: (targetAudience: TargetAudience) => void;
  personas: any
  currentUserSelectedProductCalls:any
}

interface ProductPersona {
  persona_name: string;
  strategy: string[];
  key_features: string[];
}

interface KeyArea {
  id: string
  text: string
}


// Add the API service function
const generateProductDetails = async (product: Product, targetAudience: TargetAudience) => {
  // Return mock data
  return {
    name: product.name,
    description: product.description,
    features: product.key_features.map(f => f.name),
    target_audience: targetAudience.name,
    price: null,
    unique_selling_points: product.key_features.map(f => f.name),
    generated_content: {
      introduction: "Welcome to our product demo!",
      key_points: ["Point 1", "Point 2", "Point 3"],
      conclusion: "Thank you for your time!"
    },
    questions: [
      "What are your main business challenges?",
      "How do you currently handle this process?",
      "What would success look like for you?"
    ]
  };
};

const CallPurposeSelector: React.FC<CallPurposeSelectorProps> = ({
  callPurpose,
  isRecording,
  setIsRecording,
  showProductDropdown,
  showFocusDropdown,
  showTargetAudienceDropdown,
  onProductDropdownToggle,
  onFocusDropdownToggle,
  onTargetAudienceDropdownToggle,
  onProductSelect,
  onFocusSelect,
  onTargetAudienceSelect,
  personas,
  currentUserSelectedProductCalls
}) => {
  const userId = getUserIdFromToken();
  const queryClient = useQueryClient();
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [callDuration, setCallDuration] = useState<number>(0);
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', userId],
    queryFn: () => getProducts(userId!),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const [savingCallDataLoading, setSavingCallDataLoading] = useState(false);
  // Add new query for product details
  const { data: productDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['productDetails', callPurpose.product?.id, callPurpose.targetAudience?.id],
    queryFn: () => generateProductDetails(callPurpose.product!, callPurpose.targetAudience!),
    enabled: !!callPurpose.product && !!callPurpose.targetAudience,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  


  // Only use voice when we have a product
  const voiceContext = callPurpose.product ? useVoice() : null;
  
  const handleStartCall = async () => {
    if (!callPurpose.product || !callPurpose.targetAudience || !voiceContext) {
      return;
    }
    try {
      setIsRecording(true);
      setStartTime(new Date());
      await voiceContext.startCall();
    } catch (error) {
      console.error('Failed to start call:', error);
    }
  };


  const handleEndCall = async () => {
    if (!voiceContext) return;
    
    await voiceContext.endCall();
    try {
      setIsRecording(false);

      // Calculate call duration
      let durationInSeconds = 0;
      if (startTime) {
        const endTime = new Date();
        durationInSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
        setCallDuration(durationInSeconds);
      }

      // Save call data before ending the call
      if (callPurpose.product && userId) {
        setSavingCallDataLoading(true);
        const callData = {
          product_id: callPurpose.product.id,
          user_id: userId,
          call_type: callPurpose.focus?.name || "Demo",
          agent_name: personas.persona_name || "AI Assistant",
          call_data: {
            transcript: voiceContext.transcript,  
            target_audience: callPurpose.targetAudience?.name,
            key_features_discussed: callPurpose.product.key_features.map(f => f.name),
            call_settings: callPurpose.product.call_settings,
            call_duration: durationInSeconds
          }
        };

        // Mock API call
        // const response = await fetch('https://web-production-dded.up.railway.app/api/call-data', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(callData)
        // });

        // if (!response.ok) {
        //   throw new Error('Failed to save call data');
        // }

        // Simulate successful API call
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Mock call data saved:', callData);

        // Invalidate and refetch calls data
        await queryClient.invalidateQueries({ queryKey: ['calls', userId] });
        toast.success('Call saved successfully');
      }
      setSavingCallDataLoading(false);
    } catch (error) {
      console.error('Failed to end call:', error);
      toast.error('Failed to save call data');
      setSavingCallDataLoading(false);
    } finally {
      setSavingCallDataLoading(false);
    }
  };

  // Get available target audiences from all target audiences
  const availableTargetAudiences = callPurpose.product?.target_audiences.reduce((acc, audience) => {
    if (audience.geography) {
      return [...acc, ...audience.geography];
    }
    return acc;
  }, [] as string[]) || [];
  const [showCallPurposeDropdown, setShowCallPurposeDropdown] = useState(false);
  const onCallPurposeDropdownToggle = () => {
    setShowCallPurposeDropdown(!showCallPurposeDropdown);
  };

  return (
    <>
      {callPurpose.product ? (
        <VoiceProvider 
          product={callPurpose.product}
          callPurpose={callPurpose.focus?.name || "Demo"}
          targetAudienceArea={callPurpose.targetAudience?.name || "Not specified"}
        >
          <div className="relative w-full max-w-full rounded-2xl bg-gradient-to-r from-[#95DEE1] to-purple-300 p-[3px]">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#95DEE1] to-purple-300 blur-[12px]"></div>
            <div className="relative rounded-2xl bg-white dark:bg-slate-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span className="text-slate-600">Call Purpose</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex flex-wrap items-center gap-2 text-center justify-center">
                  <h2 className="text-slate-600 text-xl">A call about</h2>
                  <div className="relative">
                    <button
                      onClick={onProductDropdownToggle}
                      disabled={isRecording}
                      className="px-3 py-1.5 text-blue-600 hover:text-blue-700 font-medium focus:outline-none inline-flex text-xl items-center gap-1"
                    >
                      <span>{callPurpose.product?.name || "Select Product"}</span>
                      <svg
                        className={`w-5 h-5 transition-transform ${showProductDropdown ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showProductDropdown && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={onProductDropdownToggle} />
                        <div
                          className="absolute left-1/2 -translate-x-1/2 z-50 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 w-[300px]"
                          style={{ top: "calc(100% + 8px)" }}
                        >
                          {isLoading ? (
                            <div className="p-4 text-center text-slate-500">Loading products...</div>
                          ) : (
                            <div className="max-h-[320px] overflow-y-auto">
                              {products.map((product: Product) => (
                                <button
                                  key={product.id}
                                  onClick={() => onProductSelect(product)}
                                  className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-medium text-slate-900 dark:text-slate-100">{product.name}</div>
                                    </div>
                                    {callPurpose.product?.id === product.id && (
                                      <svg
                                        className="w-5 h-5 text-blueF-600 dark:text-blue-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className={`relative flex flex-wrap items-center gap-2 text-center ${callPurpose.product && callPurpose.focus ? 'justify-start' : 'justify-center'}`}>
                  <h2 className="text-slate-600 text-xl">with focus on</h2>
                  <div className="relative">
                    <button
                      onClick={onTargetAudienceDropdownToggle}
                      disabled={isRecording || !callPurpose.product}
                      className="px-3 py-1.5 text-blue-600 hover:text-blue-700 font-medium focus:outline-none inline-flex text-xl items-center gap-1"
                    >
                      <span>{callPurpose.targetAudience?.name || "Select Target Audience"}</span>
                      <svg
                        className={`w-5 h-5 transition-transform ${showTargetAudienceDropdown ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showTargetAudienceDropdown && callPurpose.product && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={onTargetAudienceDropdownToggle} />
                        <div
                          className="absolute left-1/2 -translate-x-1/2 z-50 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 w-[300px]"
                          style={{ top: "calc(100% + 8px)" }}
                        >
                          <div className="max-h-[320px] overflow-y-auto">
                            {availableTargetAudiences.map((geography, index) => (
                              <button
                                key={geography}
                                onClick={() => onTargetAudienceSelect({
                                  id: geography,
                                  name: geography,
                                  description: ""
                                })}
                                className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-medium text-slate-900 dark:text-slate-100">{geography}</div>
                                  </div>
                                  {callPurpose.targetAudience?.name === geography && (
                                    <svg
                                      className="w-5 h-5 text-blue-600 dark:text-blue-400"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {callPurpose.product && callPurpose.targetAudience && (
                <div className="mt-8">
                  <div className="flex flex-wrap gap-8">
                    <div>
                      <div className="text-sm text-slate-500">Previous Calls</div>
                      <div className="text-2xl font-semibold">{currentUserSelectedProductCalls?.length||0}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Average Score</div>
                      <div className="text-2xl font-semibold text-green-500">0%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Key Areas to Focus */}
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                          </div>
                          <h3 className="font-medium">Key Areas to Focus</h3>
                        </div>
                        <div className="space-y-3">
                          {callPurpose.product.key_features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium">
                                {index + 1}
                              </div>
                              <span className="text-slate-600 dark:text-slate-300">{feature.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Key Features */}
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                          </div>
                          <h3 className="font-medium">Key Features</h3>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Service Overview</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{callPurpose.product.description}</p>
                        </div>
                      </div>

                      {/* Pricing Options */}
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <h3 className="font-medium">Call Settings</h3>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Duration:</span>
                            <span className="font-medium">{callPurpose.product.call_settings.duration} minutes</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Warmup Time:</span>
                            <span className="font-medium">{callPurpose.product.call_settings.warmupTime} minutes</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Max Attempts:</span>
                            <span className="font-medium">{callPurpose.product.call_settings.maxAttempts}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Suggested Questions */}
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <h3 className="font-medium">Suggested Questions</h3>
                        </div>
                        <div className="space-y-3">
                          {isLoadingDetails ? (
                            <p className="text-slate-500 italic">Loading questions...</p>
                          ) : productDetails?.questions ? (
                            productDetails.questions.slice(0, 3).map((question: string, index: number) => (
                              <p key={index} className="text-slate-600 dark:text-slate-300">
                               <span className="font-medium bg-blue-100 text-blue-600 rounded-full px-2 py-1">{index + 1}</span> {question}
                              </p>
                            ))
                          ) : (
                            <p className="text-slate-500 italic">No specific questions available for this audience</p>
                          )}
                        </div>
                      </div>

                      {/* Target Audience Details */}
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                          </div>
                          <h3 className="font-medium">Target Audience Details</h3>
                        </div>
                        <div className="mt-4 space-y-3">
                          {callPurpose.product?.target_audiences?.[0] && (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-500 min-w-[100px]">Name:</span>
                                <span className="text-slate-600 dark:text-slate-300">{callPurpose.product.target_audiences[0].name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-500 min-w-[100px]">Age Group:</span>
                                <span className="text-slate-600 dark:text-slate-300">{callPurpose.product.target_audiences[0].age_group?.join(', ')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-500 min-w-[100px]">Budget:</span>
                                <span className="text-slate-600 dark:text-slate-300">{callPurpose.product.target_audiences[0].budget_range?.join(', ')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-500 min-w-[100px]">Gender:</span>
                                <span className="text-slate-600 dark:text-slate-300">{callPurpose.product.target_audiences[0].gender?.join(', ')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-500 min-w-[100px]">Geography:</span>
                                <span className="text-slate-600 dark:text-slate-300">{callPurpose.product.target_audiences[0].geography?.join(', ')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-500 min-w-[100px]">Industry:</span>
                                <span className="text-slate-600 dark:text-slate-300">{callPurpose.product.target_audiences[0].industry?.join(', ')}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transcript Display */}
                  {voiceContext?.transcript && (
                    <div className="mt-6 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <h3 className="font-medium mb-2">Live Transcript</h3>
                      <div className="max-h-48 overflow-y-auto">
                        <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{voiceContext.transcript}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Start New Call Section */}
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 sm:gap-0">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-medium">Start New Call</h3>
                </div>
                {!voiceContext?.isCallActive ? (
                  <button 
                    onClick={handleStartCall}
                    disabled={!callPurpose.product || !callPurpose.targetAudience || voiceContext?.isProcessing}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {/* <Phone className="w-5 h-5" /> */}
                    {savingCallDataLoading ? <Spinner className="w-5 h-5" /> : voiceContext?.isProcessing ? 'Connecting...' : <><Phone className="w-5 h-5" />Start Call</>}
        
              
                  </button>
                
              ) : (
                  
                  <>
                  <button 
                    onClick={handleEndCall}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
                    disabled={voiceContext?.isProcessing}
                  >
                    
                    {savingCallDataLoading ? <Spinner className="w-5 h-5" /> : voiceContext?.isProcessing? "connecting...":<><Phone className="w-5 h-5" />End Call</>}
                  </button>
                  </>
                )}
              </div>

              {voiceContext?.error && (
                <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
                  {voiceContext.error.message}
                </div>
              )}
            </div>
          </div>
        </VoiceProvider>
      ) : (
        <div className="relative w-full max-w-full rounded-2xl bg-gradient-to-r from-[#95DEE1] to-purple-300 p-[3px]">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#95DEE1] to-purple-300 blur-[12px]"></div>
          <div className="relative rounded-2xl bg-white dark:bg-slate-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span className="text-slate-600">Call Purpose</span>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex items-center">
                <div className="relative">
                  <button
                    onClick={onCallPurposeDropdownToggle}
                    disabled={isRecording}
                    className="px-3 py-1.5 text-blue-600 hover:text-blue-700 font-medium focus:outline-none inline-flex text-sm items-center gap-1 z-50"
                  >
                    <span>{callPurpose.focus?.name || "Select Call Purpose"}</span>
                    <svg
                      className={`w-5 h-5 transition-transform ${showCallPurposeDropdown ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showCallPurposeDropdown && (
                    <div className="absolute left-0 top-full z-50 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 w-[300px]">
                      {/* <div className="p-4">
                        <h3 className="font-medium">Select Call Purpose</h3>
                      </div> */}
                      <div className="max-h-[320px] overflow-y-auto">
                        {[
                          { id: "1", name: "Demo", description: "Demonstrate product features and benefits" },
                          { id: "2", name: "Discovery", description: "Learn about customer needs and pain points" },
                          { id: "3", name: "Objection Handling", description: "Address customer concerns and objections" },
                          { id: "4", name: "Closing", description: "Guide the customer toward making a decision" }
                        ].map((purpose) => (
                          <button
                            key={purpose.id}
                            onClick={() => {
                              onFocusSelect({ id: purpose.id, name: purpose.name });
                              setShowCallPurposeDropdown(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-sm text-slate-900 dark:text-slate-100">{purpose.name}</div>
                                {/* <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                  {purpose.description}
                                </div> */}
                              </div>
                              {callPurpose.focus?.name === purpose.name && (
                                <svg
                                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            </div>
            

            <div className="relative flex flex-wrap items-center gap-2 text-center justify-center">
              <h2 className="text-slate-600 text-xl">A call about</h2>
              <div className="relative">
                <button
                  onClick={onProductDropdownToggle}
                  disabled={isRecording}
                  className="px-3 py-1.5 text-blue-600 hover:text-blue-700 font-medium focus:outline-none inline-flex text-xl items-center gap-1"
                >
                  <span>Select Product</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${showProductDropdown ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showProductDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={onProductDropdownToggle} />
                    <div
                      className="absolute left-1/2 -translate-x-1/2 z-50 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 w-[300px]"
                      style={{ top: "calc(100% + 8px)" }}
                    >
                      {isLoading ? (
                        <div className="p-4 text-center text-slate-500">Loading products...</div>
                      ) : (
                        <div className="max-h-[320px] overflow-y-auto">
                          {products.map((product: Product) => (
                            <button
                              key={product.id}
                              onClick={() => onProductSelect(product)}
                              className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-slate-900 dark:text-slate-100">{product.name}</div>
                                </div>
                                {callPurpose.product?.id === product.id && (
                                  <svg
                                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CallPurposeSelector
