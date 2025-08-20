import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface KeyFeature {
    name: string;
    description: string;
}

interface TargetAudience {
    name: string;
    description: string;
}

interface CallSettings {
    duration: number;
    warmupTime: number;
    maxAttempts: number;
}

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

interface ProductsState {
    products: Product[];
    currentProduct: Product | null;
}

const initialProducts: Product[] = [
    {
        id: 1,
        name: 'Product A',
        description: 'A revolutionary product that solves complex problems',
        key_features: [
            { name: 'Feature 1', description: 'Description of feature 1' },
            { name: 'Feature 2', description: 'Description of feature 2' },
        ],
        target_audiences: [
            { name: 'Small Business', description: 'Ideal for small businesses' },
            { name: 'Enterprise', description: 'Perfect for large enterprises' },
        ],
        call_settings: {
            duration: 30,
            warmupTime: 5,
            maxAttempts: 3
        }
    },
    {
        id: 2,
        name: 'Product B',
        description: 'An innovative solution for modern challenges',
        key_features: [
            { name: 'Feature 1', description: 'Description of feature 1' },
        ],
        target_audiences: [
            { name: 'Startup', description: 'Great for startups' },
        ],
        call_settings: {
            duration: 30,
            warmupTime: 5,
            maxAttempts: 3
        }
    }
];

// Load products from localStorage if available
const loadProducts = () => {
    if (typeof window !== 'undefined') {
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
            try {
                return JSON.parse(savedProducts);
            } catch (e) {
                console.error('Error parsing saved products:', e);
                return initialProducts;
            }
        }
    }
    return initialProducts;
};

const initialState: ProductsState = {
    products: loadProducts(),
    currentProduct: null,
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<Product>) => {
            const newProduct = {
                ...action.payload,
                id: state.products.length > 0 
                    ? Math.max(...state.products.map(p => p.id || 0)) + 1 
                    : 1
            };
            state.products.push(newProduct);
            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('products', JSON.stringify(state.products));
            }
        },
        updateProduct: (state, action: PayloadAction<Product>) => {
            const index = state.products.findIndex(p => p.id === action.payload.id);
            if (index !== -1) {
                state.products[index] = action.payload;
                // Save to localStorage
                if (typeof window !== 'undefined') {
                    localStorage.setItem('products', JSON.stringify(state.products));
                }
            }
        },
        deleteProduct: (state, action: PayloadAction<number>) => {
            state.products = state.products.filter(p => p.id !== action.payload);
            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('products', JSON.stringify(state.products));
            }
        },
        setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
            state.currentProduct = action.payload;
        },
        clearCurrentProduct: (state) => {
            state.currentProduct = null;
        },
    },
});

export const { 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    setCurrentProduct, 
    clearCurrentProduct 
} = productsSlice.actions;

export default productsSlice.reducer; 