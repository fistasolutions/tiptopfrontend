"use client"
import { IconLoader, IconTrash } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, updateProduct, setCurrentProduct, clearCurrentProduct } from '@/store/slices/productsSlice';
import { RootState } from '@/store/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct as createProductApi, updateProduct as updateProductApi, Product } from '@/services/productService';
import { getUserIdFromToken } from '@/utils/auth';


// Update the interface to match the API response
interface ProductResponse extends Omit<Product, 'key_features' | 'target_audiences' | 'call_settings'> {
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
  status: boolean;
  user_id: number;
}

const Addproduct = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const currentProduct = useSelector((state: RootState) => state.products?.currentProduct || null);
    const userId = getUserIdFromToken();

    const [defaultParams] = useState({
        id: null,
        name: '',
        description: '',
        key_features: [],
        target_audiences: [],
        call_settings: {
            duration: 30,
            warmupTime: 5,
            maxAttempts: 3
        }
    });

    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));
    const [loading, setLoading] = useState(false);

    // Add new constants for options
    const GEOGRAPHY_OPTIONS = [
        "APAC",
        "Asia",
        "Europe",
        "North America",
        "South America",
        "Africa",
        "Oceania",
        "Middle East",

    ];

    const INDUSTRY_OPTIONS = [
        'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing',
        'Real Estate', 'Transportation', 'Energy', 'Agriculture', 'Entertainment'
    ];

    const BUDGET_RANGES = [
        'Under $100',
        '$100–$500',
        '$500–$1000',
        '$1000+'
    ];

    const AGE_GROUPS = [
        '18–24',
        '25–34',
        '35–44',
        '45–60',
        '60+'
    ];

    const GENDER_OPTIONS = [
        'Male',
        'Female',
        'Non-binary',
        'Prefer not to say'
    ];


    const handleCreateProductPersona = async (product: Product) => {
        // Return mock data
        return {
            id: Math.floor(Math.random() * 1000),
            product_name: product.name,
            product_description: product.description,
            key_features: JSON.stringify(product.key_features),
            target_audience: JSON.stringify(product.target_audiences),
            price_range: "3000000",
            user_id: String(product.user_id),
            product_id: String(product.id),
            persona_name: "Enterprise Sales Rep",
            persona_description: "Experienced sales professional focused on enterprise clients"
        };
    };


    useEffect(() => {
        if (!userId) {
            showMessage('Please login to continue', 'error');
            router.push('/login');
            return;
        }

        if (currentProduct) {
            setParams(currentProduct);
        } else {
            setParams(JSON.parse(JSON.stringify(defaultParams)));
        }
    }, [currentProduct, userId]);

    const createMutation = useMutation({
        mutationFn: (product: Product) => {
            if (!userId) throw new Error('User not authenticated');
            return createProductApi(product, userId);
        },
        onSuccess: async (data: Product) => {
            dispatch(addProduct(data));
            try {
                await handleCreateProductPersona(data);
                queryClient.invalidateQueries({ queryKey: ['products'] });
                showMessage('Product has been saved successfully.');
                router.push('/products');
            } catch (error) {
                showMessage('Failed to generate product persona', 'error');
            } finally {
                setLoading(false);
            }
        },
        onError: (error) => {
            showMessage('Failed to create product', 'error');
            setLoading(false);
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, product }: { id: number, product: Product }) => {
            if (!userId) throw new Error('User not authenticated');
            return updateProductApi(id, product, userId);
        },
        onSuccess: (data: Product) => {
            console.log(data);
            dispatch(updateProduct(data));
            queryClient.invalidateQueries({ queryKey: ['products'] });
            showMessage('Product has been updated successfully.');
            router.push('/products');
            setLoading(false);
        },
        onError: (error) => {
            showMessage('Failed to update product', 'error');
            setLoading(false);
        }
    });

    const addKeyFeature = () => {
        setParams({
            ...params,
            key_features: [...params.key_features, { name: '', description: '' }],
        });
    };

    const removeKeyFeature = (index: number) => {
        const newKeyFeatures = [...params.key_features];
        newKeyFeatures.splice(index, 1);
        setParams({
            ...params,
            key_features: newKeyFeatures,
        });
    };

    const addTargetAudience = () => {
        setParams({
            ...params,
            target_audiences: [...params.target_audiences, {
                name: 'Target Audience',
                description: '',
                geography: [],
                industry: [],
                budget_range: [],
                age_group: [],
                gender: []
            }],
        });
    };

    const removeTargetAudience = (index: number) => {
        const newTargetAudiences = [...params.target_audiences];
        newTargetAudiences.splice(index, 1);
        setParams({
            ...params,
            target_audiences: newTargetAudiences,
        });
    };

    const changeKeyFeature = (index: number, field: string, value: string) => {
        const newKeyFeatures = [...params.key_features];
        newKeyFeatures[index] = {
            ...newKeyFeatures[index],
            [field]: value,
        };
        setParams({
            ...params,
            key_features: newKeyFeatures,
        });
    };

    const changeTargetAudience = (index: number, field: string, value: any) => {
        const newTargetAudiences = [...params.target_audiences];
        newTargetAudiences[index] = {
            ...newTargetAudiences[index],
            [field]: value,
        };
        setParams({
            ...params,
            target_audiences: newTargetAudiences,
        });
    };

    const changeCallSettings = (field: string, value: number) => {
        setParams({
            ...params,
            call_settings: {
                ...params.call_settings,
                [field]: value
            }
        });
    };

    const saveUser = async () => {
        setLoading(true)
        if (!params.name) {
            showMessage('Name is required.', 'error');
            setLoading(false);
            return true;
        }
        if (!params.description) {
            showMessage('Description is required.', 'error');
            setLoading(false);
            return true;
        }
        if (!userId) {
            showMessage('User not authenticated.', 'error');
            setLoading(false);
            return true;
        }

        const productData: Product = {
            id: params.id || null,
            name: params.name,
            description: params.description,
            key_features: params.key_features.filter((feature: any) => feature.name.trim() !== ''),
            target_audiences: params.target_audiences.map((audience: any) => ({
                name: audience.name || '',
                description: audience.description || '',
                geography: audience.geography || [],
                industry: audience.industry || [],
                budget_range: audience.budget_range || [],
                age_group: audience.age_group || [],
                gender: audience.gender || []
            })),
            call_settings: {
                duration: params.call_settings.duration || 30,
                warmupTime: params.call_settings.warmupTime || 5,
                maxAttempts: params.call_settings.maxAttempts || 3
            },
            user_id: userId
        };

        if (params.id) {
            updateMutation.mutate({ id: params.id, product: productData });
        } else {
            createMutation.mutate(productData);
        }
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const handleCancel = () => {
        dispatch(clearCurrentProduct());
        router.push('/products');
    };

    return (
        <div>
            <div className="panel mt-5">
                <div className="mb-5">
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Enter Product Name"
                        className="form-input"
                        value={params.name}
                        onChange={(e) => setParams({ ...params, name: e.target.value })}
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        rows={3}
                        placeholder="Enter Product Description"
                        className="form-textarea min-h-[130px] resize-none"
                        value={params.description}
                        onChange={(e) => setParams({ ...params, description: e.target.value })}
                    ></textarea>
                </div>

                {/* Call Settings Section */}
                <div className="mb-5">
                    <h3 className="mb-3 text-lg font-semibold">Call Settings</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label htmlFor="duration">Duration (minutes)</label>
                            <input
                                id="duration"
                                type="number"
                                className="form-input"
                                value={params.call_settings?.duration}
                                min={1}
                                onChange={(e) => changeCallSettings('duration', parseInt(e.target.value))}
                            />
                        </div>
                        <div>
                            <label htmlFor="warmupTime">Warmup Time (minutes)</label>
                            <input
                                id="warmupTime"
                                type="number"
                                className="form-input"
                                value={params.call_settings?.warmupTime}
                                min={0}
                                onChange={(e) => changeCallSettings('warmupTime', parseInt(e.target.value))}
                            />
                        </div>
                        <div>
                            <label htmlFor="maxAttempts">Max Attempts</label>
                            <input
                                id="maxAttempts"
                                type="number"
                                className="form-input"
                                value={params.call_settings?.maxAttempts}
                                min={1}
                                onChange={(e) => changeCallSettings('maxAttempts', parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-5">
                    <label>Key Features</label>
                    <div className="grid grid-cols-1 gap-4 w-1/2">
                        {params.key_features.map((feature: any, index: number) => (
                            <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        placeholder="Enter Feature Name"
                                        className="form-input"
                                        value={feature.name}
                                        onChange={(e) => changeKeyFeature(index, 'name', e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <textarea
                                        placeholder="Enter Feature Description"
                                        className="form-textarea"
                                        value={feature.description}
                                        onChange={(e) => changeKeyFeature(index, 'description', e.target.value)}
                                    ></textarea>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={() => removeKeyFeature(index)}
                                >
                                    <IconTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center mt-4">
                        <button type="button" className="btn btn-outline-primary" onClick={addKeyFeature}>
                            Add Key Feature
                        </button>
                    </div>
                </div>
                <div className="mb-5">
                    <label>Target Audiences</label>
                    <div className="grid grid-cols-1 gap-4 w-1/2">
                        {params.target_audiences.map((audience: any, index: number) => (
                            <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                {/* <div className="mb-3">
                                    <input
                                        type="text"
                                        placeholder="Enter Audience Type"
                                        className="form-input"
                                        value={audience.name}
                                        onChange={(e) => changeTargetAudience(index, 'name', e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <textarea
                                        placeholder="Enter Audience Description"
                                        className="form-textarea"
                                        value={audience.description}
                                        onChange={(e) => changeTargetAudience(index, 'description', e.target.value)}
                                    ></textarea>
                                </div> */}

                                {/* Geography Multi-select */}
                                <div className="mb-3">
                                    <label className="block mb-2">Geography</label>
                                    {audience.geography?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {audience.geography.map((geo: string, geoIndex: number) => (
                                                <span key={geoIndex} className="px-2 py-1 bg-gray-100 rounded-full text-sm flex items-center">
                                                    {geo}
                                                    <button
                                                        type="button"
                                                        className="ml-1 text-red-500 hover:text-red-700"
                                                        onClick={() => {
                                                            const newGeography = audience.geography.filter((_: string, i: number) => i !== geoIndex);
                                                            changeTargetAudience(index, 'geography', newGeography);
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="relative">
                                        <select
                                            className="form-select w-full"
                                            value=""
                                            onChange={(e) => {
                                                if (e.target.value && !audience.geography?.includes(e.target.value)) {
                                                    changeTargetAudience(index, 'geography', [...(audience.geography || []), e.target.value]);
                                                }
                                                e.target.value = ''; // Reset the select
                                            }}
                                        >
                                            <option value="">Select Geography</option>
                                            {GEOGRAPHY_OPTIONS.filter(option => !audience.geography?.includes(option)).map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Industry Multi-select */}
                                <div className="mb-3">
                                    <label className="block mb-2">Industry</label>
                                    {audience.industry?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {audience.industry.map((ind: string, indIndex: number) => (
                                                <span key={indIndex} className="px-2 py-1 bg-gray-100 rounded-full text-sm flex items-center">
                                                    {ind}
                                                    <button
                                                        type="button"
                                                        className="ml-1 text-red-500 hover:text-red-700"
                                                        onClick={() => {
                                                            const newIndustry = audience.industry.filter((_: string, i: number) => i !== indIndex);
                                                            changeTargetAudience(index, 'industry', newIndustry);
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="relative">
                                        <select
                                            className="form-select w-full"
                                            value=""
                                            onChange={(e) => {
                                                if (e.target.value && !audience.industry?.includes(e.target.value)) {
                                                    changeTargetAudience(index, 'industry', [...(audience.industry || []), e.target.value]);
                                                }
                                                e.target.value = ''; // Reset the select
                                            }}
                                        >
                                            <option value="">Select Industry</option>
                                            {INDUSTRY_OPTIONS.filter(option => !audience.industry?.includes(option)).map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Budget Range Multi-select */}
                                <div className="mb-3">
                                    <label className="block mb-2">Budget Range</label>
                                    {audience.budget_range?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {audience.budget_range.map((budget: string, budgetIndex: number) => (
                                                <span key={budgetIndex} className="px-2 py-1 bg-gray-100 rounded-full text-sm flex items-center">
                                                    {budget}
                                                    <button
                                                        type="button"
                                                        className="ml-1 text-red-500 hover:text-red-700"
                                                        onClick={() => {
                                                            const newBudgetRange = audience.budget_range.filter((_: string, i: number) => i !== budgetIndex);
                                                            changeTargetAudience(index, 'budget_range', newBudgetRange);
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="relative">
                                        <select
                                            className="form-select w-full"
                                            value=""
                                            onChange={(e) => {
                                                if (e.target.value && !audience.budget_range?.includes(e.target.value)) {
                                                    changeTargetAudience(index, 'budget_range', [...(audience.budget_range || []), e.target.value]);
                                                }
                                                e.target.value = ''; // Reset the select
                                            }}
                                        >
                                            <option value="">Select Budget Range</option>
                                            {BUDGET_RANGES.filter(option => !audience.budget_range?.includes(option)).map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Age Group Multi-select */}
                                <div className="mb-3">
                                    <label className="block mb-2">Age Group</label>
                                    {audience.age_group?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {audience.age_group.map((age: string, ageIndex: number) => (
                                                <span key={ageIndex} className="px-2 py-1 bg-gray-100 rounded-full text-sm flex items-center">
                                                    {age}
                                                    <button
                                                        type="button"
                                                        className="ml-1 text-red-500 hover:text-red-700"
                                                        onClick={() => {
                                                            const newAgeGroup = audience.age_group.filter((_: string, i: number) => i !== ageIndex);
                                                            changeTargetAudience(index, 'age_group', newAgeGroup);
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="relative">
                                        <select
                                            className="form-select w-full"
                                            value=""
                                            onChange={(e) => {
                                                if (e.target.value && !audience.age_group?.includes(e.target.value)) {
                                                    changeTargetAudience(index, 'age_group', [...(audience.age_group || []), e.target.value]);
                                                }
                                                e.target.value = ''; // Reset the select
                                            }}
                                        >
                                            <option value="">Select Age Group</option>
                                            {AGE_GROUPS.filter(option => !audience.age_group?.includes(option)).map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Gender Multi-select */}
                                <div className="mb-3">
                                    <label className="block mb-2">Gender</label>
                                    {audience.gender?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {audience.gender.map((gen: string, genIndex: number) => (
                                                <span key={genIndex} className="px-2 py-1 bg-gray-100 rounded-full text-sm flex items-center">
                                                    {gen}
                                                    <button
                                                        type="button"
                                                        className="ml-1 text-red-500 hover:text-red-700"
                                                        onClick={() => {
                                                            const newGender = audience.gender.filter((_: string, i: number) => i !== genIndex);
                                                            changeTargetAudience(index, 'gender', newGender);
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="relative">
                                        <select
                                            className="form-select w-full"
                                            value=""
                                            onChange={(e) => {
                                                if (e.target.value && !audience.gender?.includes(e.target.value)) {
                                                    changeTargetAudience(index, 'gender', [...(audience.gender || []), e.target.value]);
                                                }
                                                e.target.value = ''; // Reset the select
                                            }}
                                        >
                                            <option value="">Select Gender</option>
                                            {GENDER_OPTIONS.filter(option => !audience.gender?.includes(option)).map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={() => removeTargetAudience(index)}
                                >
                                    <IconTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <button type="button" className="btn btn-outline-primary" onClick={addTargetAudience}>
                            Add Target Audience
                        </button>
                    </div>
                </div>
                <div className="flex justify-end gap-4">
                    <button type="button" className="btn btn-outline" onClick={handleCancel}>
                        Cancel
                    </button>
                    {loading ? (
                        <button className="btn btn-primary" disabled>
                            <IconLoader className="animate-spin" />
                        </button>
                    ) : (
                        <button type="button" className="btn btn-primary" onClick={saveUser} disabled={loading}>
                            {params.id ? 'Update' : 'Save'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Addproduct;
