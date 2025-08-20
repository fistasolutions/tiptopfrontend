// Template version
export const getProductPersonas = async (productId: number) => {
  // Return mock data
  return [
    {
      id: 1,
      product_id: productId,
      persona_name: "Enterprise Sales Rep",
      persona_description: "Experienced sales professional focused on enterprise clients",
      traits: ["Professional", "Knowledgeable", "Persuasive"],
      conversation_style: "Formal and consultative",
      expertise_level: "Advanced"
    }
  ];
};

export const getUserProductPersonas = async (userId: number) => {
  // Return mock data
  return [
    {
      id: 1,
      product_id: 1,
      user_id: userId,
      persona_name: "Enterprise Sales Rep",
      persona_description: "Experienced sales professional focused on enterprise clients",
      traits: ["Professional", "Knowledgeable", "Persuasive"],
      conversation_style: "Formal and consultative",
      expertise_level: "Advanced"
    }
  ];
};
