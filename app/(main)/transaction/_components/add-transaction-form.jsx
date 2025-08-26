"use client"
import { updateDefaultAccount } from '@/actions/account'
import useFetch from '@/hooks/use-fetch'
import { accountSchema, transactionSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { Suspense, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import CreateAccountDrawer from '@/components/create-account-drawer'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from 'date-fns'
import { Calendar1Icon, Loader2 } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Switch } from '@/components/ui/switch'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { createTransaction, updateTransaction } from '@/actions/transaction'
import ReceiptScanner from './receipt-scanner'
import { BarLoader } from 'react-spinners'

const AddTransactionForm = ({ accounts, categories, editMode = false, initialData = null }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");

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
        defaultValues:
            editMode && initialData
                ? {
                    type: initialData.type,
                    amount: initialData.amount.toString(),
                    description: initialData.description,
                    accountId: initialData.accountId,
                    category: initialData.category,
                    date: new Date(initialData.date),
                    isRecurring: initialData.isRecurring,
                    ...(initialData.recurringInterval && {
                        recurringInterval: initialData.recurringInterval,
                    }),
                }
                : {
                    type: "EXPENSE",
                    amount: "",
                    description: "",
                    accountId: accounts.find((ac) => ac.isDefault)?.id,
                    date: new Date(),
                    isRecurring: false,
                },
    });

    const {
        loading: transactionLoading,
        fn: transactionFn,
        data: transactionResult,
    } = useFetch(editMode ? updateTransaction : createTransaction);

    const type = watch("type");
    const isRecurring = watch("isRecurring");
    const date = watch("date");

    const onSubmit = async (data) => {
        const formData = {
            ...data,
            amount: parseFloat(data.amount),
            date: date.date instanceof Date ? data.date.toISOString() : data.date,
        };

        if (editMode) {
            transactionFn(editId, formData);
        }
        else {
            transactionFn(formData);
        }
    };

    useEffect(() => {
        if (transactionResult?.success && !transactionLoading) {
            toast.success(
                editMode
                    ? "Transaction updated successfully"
                    : "Transaction created successfully"
            );
            reset();
            router.push(`/account/${transactionResult.data.accountId}`);
        }
        else if (transactionResult?.error && !transactionLoading) {
            toast.error(transactionResult.error);
        }
    }, [transactionResult, transactionLoading, editMode]);

    const filteredCategories = categories.filter(
        (category) => category.type === type
    );

    const handleScanComplete = (scannedData) => {
        if (scannedData) {
            setValue("amount", scannedData.amount.toString());
            setValue("date", new Date(scannedData.date));
            if (scannedData.description) {
                setValue("description", scannedData.description);
            }
            if (scannedData.category) {
                setValue("category", scannedData.category);
            }
        }
    }

    return (
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
            {/* AI Receipt Scanner */}
            {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />}

            {/* Create Transaction Form */}
            <div className='space-y-2'>
                <label className='text-sm font-medium'>
                    Type
                </label>
                <Select onValueChange={(value) => setValue("type", value)} defaultValue={getValues("type")}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="EXPENSE">Expense</SelectItem>
                        <SelectItem value="INCOME">Income</SelectItem>
                    </SelectContent>
                </Select>

                {errors.type && (
                    <p className='text-sm text-red-500'>
                        {errors.type.message}
                    </p>
                )}
            </div>
            <div className='grid gap-6 md:grid-cols-2'>
                <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                        Amount
                    </label>
                    <Input
                        type={"number"}
                        step="0.01"
                        placeholder="0.00"
                        {...register("amount")} />

                    {errors.amount && (
                        <p className='text-sm text-red-500'>
                            {errors.amount.message}
                        </p>
                    )}
                </div>
                <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                        Account
                    </label>
                    <Select onValueChange={(value) => setValue("accountId", value)} defaultValue={getValues("accountId")}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            {accounts.map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                    {account.name} (Rs.{parseFloat(account.balance).toFixed(2)})
                                </SelectItem>
                            ))}
                            <CreateAccountDrawer>
                                <Button variant={"ghost"} className="w-full select-none items-center text-sm outline-none">
                                    Create Account
                                </Button>
                            </CreateAccountDrawer>
                        </SelectContent>
                    </Select>

                    {errors.accountId && (
                        <p className='text-sm text-red-500'>
                            {errors.accountId.message}
                        </p>
                    )}
                </div>
            </div>

            <div className='space-y-2'>
                <label className='text-sm font-medium'>
                    Category
                </label>
                <Select onValueChange={(value) => setValue("category", value)} defaultValue={getValues("category")}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {filteredCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {errors.category && (
                    <p className='text-sm text-red-500'>
                        {errors.category.message}
                    </p>
                )}
            </div>

            <div className='space-y-2'>
                <label className='text-sm font-medium'>
                    Date
                </label>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={"outline"} className={"w-full pl-3 text-left font-normal"}>
                            {
                                date
                                    ? format(date, "PPP")
                                    : <span>Pick a date</span>
                            }
                            <Calendar1Icon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className={"w-auto p-0"} align='start'>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(date) => setValue("date", date)}
                            disabled={(date) =>
                                date > new Date() || date < new Date("1990-01-01")} initialFocus />
                    </PopoverContent>
                </Popover>

                {errors.date && (
                    <p className='text-sm text-red-500'>
                        {errors.date.message}
                    </p>
                )}
            </div>

            <div className='space-y-2'>
                <label className='text-sm font-medium'>
                    Description
                </label>
                <Input
                    placeholder="Enter description"
                    {...register("description")} />

                {errors.description && (
                    <p className='text-sm text-red-500'>
                        {errors.description.message}
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                    <label
                        className="text-base font-medium cursor-pointer"
                    >
                        Recurring Transaction
                    </label>
                    <p className="text-sm text-muted-foreground">
                        Set up a recurring schedule for this transaction.
                    </p>
                </div>
                <Switch
                    checked={isRecurring}
                    onCheckedChange={(checked) => setValue("isRecurring", checked)}
                />
            </div>

            {isRecurring &&
                <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                        Recurring Interval
                    </label>
                    <Select onValueChange={(value) => setValue("recurringInterval", value)} defaultValue={getValues("recurringInterval")}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Interval" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="DAILY">Daily</SelectItem>
                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                            <SelectItem value="YEARLY">Yearly</SelectItem>
                        </SelectContent>
                    </Select>

                    {errors.recurringInterval && (
                        <p className='text-sm text-red-500'>
                            {errors.recurringInterval.message}
                        </p>
                    )}
                </div>}

            <Suspense
                fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
            >
                <div className="flex gap-4 items-center flex-col mb-20">
                    {transactionLoading && (
                        <BarLoader
                            className="w-full"
                            width={"100%"}
                            color="#9333ea"
                        />
                    )}
                    <Button
                        type="button"
                        variant={"outline"}
                        className={"w-full"}
                        onClick={() => router.back()}
                    >
                        Cancel</Button>
                    <Button
                        className="w-full"
                        type="submit"
                        disabled={transactionLoading}
                    >
                        {transactionLoading ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                {editMode
                                    ? "Updating..."
                                    : " Creating..."}
                            </>
                        ) : editMode ? (
                            "Update Transaction"
                        ) : (
                            "Create Transaction"
                        )
                        }
                    </Button>
                </div>
            </Suspense>
        </form >
    )
}

export default AddTransactionForm