"use client"
import { updateDefaultAccount } from '@/actions/account'
import useFetch from '@/hooks/use-fetch'
import { accountSchema, transactionSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
const AddTransactionForm = ({ accounts, categories }) => {

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
        watch,
        getValues,
        reset,
    } = useForm({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((ac) => ac.iSDefault)?.id,
            date: new Date(),
            isRecurring: false,
        },
    });

    const {
        loading: transactionLoading,
        fn: transactionFn,
        data: transactionResult,
    } = useFetch(updateDefaultAccount);

    const type = watch("type");
    const isRecurring = watch("isRecurring");
    const date = watch("date");

    return (
        <form action="">
            {/* AI Receipt Scanner */}

            {/* Create Transaction Form */}
            <div>
                <label>
                    Type
                </label>
                <Select onValueChange={(value) => setValue("type", value)} defaultValue="type">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="EXPENSE">Expense</SelectItem>
                        <SelectItem value="INCOME">Income</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </form>
    )
}

export default AddTransactionForm
