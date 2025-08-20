'use client';
import IconFacebook from '@/components/icon/icon-facebook';
import IconInstagram from '@/components/icon/icon-instagram';
import IconLayoutGrid from '@/components/icon/icon-layout-grid';
import IconLinkedin from '@/components/icon/icon-linkedin';
import IconListCheck from '@/components/icon/icon-list-check';
import IconSearch from '@/components/icon/icon-search';
import IconTwitter from '@/components/icon/icon-twitter';
import IconUser from '@/components/icon/icon-user';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconX from '@/components/icon/icon-x';
import { Transition, Dialog } from '@headlessui/react';
import React, { Fragment, useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import IconTrash from '@/components/icon/icon-trash';
import { useDispatch } from 'react-redux';
import { setCurrentProduct } from '@/store/slices/productsSlice';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, deleteProduct as deleteProductApi } from '@/services/productService';
import { getUserIdFromToken } from '@/utils/auth';

const ProductManagement = () => {
    const [value, setValue] = useState<any>('list');
    const [search, setSearch] = useState<any>('');
    const router = useRouter();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const userId = getUserIdFromToken();
    
    // Use the prefetched data from the server
    const { data: products = [], isLoading, error } = useQuery({
        queryKey: ['products', userId],
        queryFn: () => getProducts(userId!),
        staleTime: 60 * 1000, // Consider data fresh for 1 minute
        refetchOnWindowFocus: false, // Don't refetch on window focus
    });

    // Delete product mutation
    const deleteMutation = useMutation({
        mutationFn: (productId: number) => deleteProductApi(productId, userId!),
        onMutate: async (productId) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['products', userId] });

            // Snapshot the previous value
            const previousProducts = queryClient.getQueryData(['products', userId]);

            // Optimistically update to the new value
            queryClient.setQueryData(['products', userId], (old: any) => {
                return old?.filter((product: any) => product.id !== productId) || [];
            });

            return { previousProducts };
        },
        onError: (err, productId, context) => {
            // Revert back to the previous value on error
            queryClient.setQueryData(['products', userId], context?.previousProducts);
            showMessage('Failed to delete product', 'error');
        },
        onSettled: () => {
            // Refetch the data to ensure it's in sync
            queryClient.invalidateQueries({ queryKey: ['products', userId] });
        },
        onSuccess: () => {
            showMessage('Product has been deleted successfully.');
        }
    });

    // Use useMemo to compute filtered items
    const filteredItems = useMemo(() => {
        if (!search) return products;
        return products.filter((item: any) => {
            return item.name.toLowerCase().includes(search.toLowerCase());
        });
    }, [products, search]);

    const editUser = (product: any = null) => {
        dispatch(setCurrentProduct(product));
        router.push('/add-product');
    };

    const deleteUser = (product: any = null) => {
        if (product?.id) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true,
                
                customClass: {
                    confirmButton: 'btn btn-danger',
                    cancelButton: 'btn btn-secondary',
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteMutation.mutate(product.id);
                }
            });
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">Error loading products. Please try again later.</div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className='flex flex-col'>
                    <h2 className="text-xl font-bold">Products Management</h2>
                    <p className='text-gray-500'>Manage your product training catalog</p>
                </div>
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex gap-3">
                        <div className='flex gap-4'>
                            <button 
                                className='btn btn-primary'
                                onClick={() => {
                                    dispatch(setCurrentProduct(null));
                                    router.push('/add-product');
                                }}
                            >
                                + Add New Product
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <input type="text" placeholder="Search Products" className="peer form-input py-2 ltr:pr-11 rtl:pl-11" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button type="button" className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
                            <IconSearch className="mx-auto" />
                        </button>
                    </div>
                </div>
            </div>

            {value === 'list' && (
                <div className="panel mt-5 overflow-hidden border-0 p-0">
                    <div className="table-responsive">
                        <table className="table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Description</th>
                                    <th>Call Settings</th>
                                    <th>Key Features</th>
                                    {/* <th>Target Audiences</th> */}
                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((product: any) => (
                                        <tr key={product.id}>
                                            <td>{product.name}</td>
                                            <td>
                                                <div className="max-w-[200px] truncate" title={product.description}>
                                                    {product.description}
                                                </div>
                                            </td>
                                            <td>
                                                <div>Duration: {product.call_settings?.duration || 30} min</div>
                                                <div>Warmup: {product.call_settings?.warmupTime || 5} min</div>
                                                <div>Max Attempts: {product.call_settings?.maxAttempts || 3}</div>
                                            </td>
                                            <td>
                                                <ul className="list-disc list-inside">
                                                    {product.key_features?.map((feature: any, index: number) => (
                                                        <ol key={index}>
                                                            <div className="font-semibold max-w-[200px] truncate" title={feature.name}>{feature.name}</div>
                                                            <div className="text-sm text-gray-600 max-w-[200px] truncate" title={feature.description}>{feature.description}</div>
                                                        </ol>
                                                    ))}
                                                </ul>
                                            </td>
                                            {/* <td>
                                                <ul className="list-disc list-inside">
                                                    {product.target_audiences?.map((audience: any, index: number) => (
                                                        <ol key={index}>
                                                            <div className="font-semibold">{audience.name}</div>
                                                            <div className="text-sm text-gray-600">{audience.description}</div>
                                                        </ol>
                                                    ))}
                                                </ul>
                                            </td> */}
                                            <td>
                                                <div className="flex items-center justify-center gap-4">
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editUser(product)}>
                                                        Edit
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(product)}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-4">
                                            No products found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
