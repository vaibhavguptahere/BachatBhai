import { getUserAccounts } from '@/actions/dashboard';
import { defaultCategories } from '@/data/categories';
import React from 'react'
import AddTransactionForm from '../_components/add-transaction-form';
import { getTransaction } from '@/actions/transaction';

const createTransaction = async ({ searchParams }) => {
    const accounts = await getUserAccounts();

    const editId = searchParams?.edit;
    let initialData = null;
    if (editId) {
        const transaction = await getTransaction(editId);
        initialData = transaction;
    }

    return (
        <div className='max-w-3xl mx-auto px-5 pt-28'>
            <h1 className='text-5xl gradient-title mb-8 text-center'>
                {!editId
                    ? (
                        "Add Transaction"
                    )
                    : (
                        "Edit Transaction"
                    )
                }
            </h1>
            <AddTransactionForm
                accounts={accounts}
                categories={defaultCategories}
                editMode={!!editId}
                initialData={initialData} />


        </div>
    )
}

export default createTransaction
