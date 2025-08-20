export interface Product {
  id?: number | null;
  name: string;
  description: string;
  key_features: Array<{ name: string; description: string }>;
  target_audiences: Array<{
    name: string;
    description: string;
    geography?: string[];
    industry?: string[];
    budget_range?: string[];
    age_group?: string[];
    gender?: string[];
  }>;
  call_settings: {
    duration: number;
    warmupTime: number;
    maxAttempts: number;
  };
  status?: boolean;
  user_id?: number;
}

// Template version
export const createProduct = async (product: Product, userId: number) => {
  // Return mock response
  return {
    ...product,
    id: Math.floor(Math.random() * 1000),
    user_id: userId,
    status: true
  } as Product;
};

export const updateProduct = async (productId: number, product: Product, userId: number) => {
  // Return mock response
  return {
    ...product,
    id: productId,
    user_id: userId,
    status: true
  };
};

export const getProducts = async (userId: number) => {
  // Return mock data
  return [
    {
      id: 1,
      name: "Sample Product",
      description: "This is a sample product description",
      key_features: [
        { name: "Feature 1", description: "Description of feature 1" },
        { name: "Feature 2", description: "Description of feature 2" }
      ],
      target_audiences: [
        {
          name: "Enterprise",
          description: "Enterprise customers",
          geography: ["North America", "Europe"],
          industry: ["Technology", "Finance"],
          budget_range: ["$1000+"],
          age_group: ["25-34", "35-44"],
          gender: ["Male", "Female"]
        }
      ],
      call_settings: {
        duration: 30,
        warmupTime: 5,
        maxAttempts: 3
      },
      status: true,
      user_id: userId
    }
  ];
};

export const getProduct = async (productId: number, userId: number) => {
  // Return mock data
  return {
    id: productId,
    name: "Sample Product",
    description: "This is a sample product description",
    key_features: [
      { name: "Feature 1", description: "Description of feature 1" },
      { name: "Feature 2", description: "Description of feature 2" }
    ],
    target_audiences: [
      {
        name: "Enterprise",
        description: "Enterprise customers",
        geography: ["North America", "Europe"],
        industry: ["Technology", "Finance"],
        budget_range: ["$1000+"],
        age_group: ["25-34", "35-44"],
        gender: ["Male", "Female"]
      }
    ],
    call_settings: {
      duration: 30,
      warmupTime: 5,
      maxAttempts: 3
    },
    status: true,
    user_id: userId
  };
};

export const deleteProduct = async (productId: number, userId: number) => {
  // Return mock response
  return { success: true };
}; 