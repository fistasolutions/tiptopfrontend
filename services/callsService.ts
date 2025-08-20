// Template version
export const getCalls = async (userId: number) => {
  // Return mock data
  return [
    {
      id: 1,
      product_id: 1,
      user_id: userId,
      call_type: "Demo",
      agent_name: "AI Assistant",
      call_data: {
        transcript: "This is a sample call transcript",
        target_audience: "Enterprise",
        key_features_discussed: ["Feature 1", "Feature 2"],
        call_settings: {
          duration: 30,
          warmupTime: 5,
          maxAttempts: 3
        },
        call_duration: 300
      },
      created_at: new Date().toISOString(),
      product_name: "Sample Product"
    }
  ];
};
