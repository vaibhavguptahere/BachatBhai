"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { accountSchema } from '@/lib/schema'
import { Input } from './ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const CreateAccountDrawer = ({ children }) => {
    const [open, setOpen] = useState(false);

    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            name: "",
            type: "CURRENT",
            balance: "",
            isDefault: false,
        }

    })

    const onSubmit = async (data) => {
        console.log(data)
    }

    return (
        <div>
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    {children}
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Create New Account</DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4 pb-4">
                        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                            <div className="space-y-2">
                                <label htmlFor="name" className='text-sm font-medium'>Account Name</label>
                                <Input id="name" placeholder="e.g., Main Checking" {...register("name")} />
                                {errors.name && (
                                    <p className='text-sm text-red-500'>{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="type" className='text-sm font-medium'>Account Type</label>
                                <Select onValueChange={(value) => setValue("type", value)} defaultValue={watch("type")}>
                                    <SelectTrigger className="w-[180px]" id="type">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CURRENT">Current</SelectItem>
                                        <SelectItem value="SAVINGS">Savings</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && (
                                    <p className='text-sm text-red-500'>{errors.type.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="balance" className='text-sm font-medium'>Initial Balance</label>
                                <Input id="balance" type="number" step="1" placeholder="0.00" {...register("balance")} />
                                {errors.balance && (
                                    <p className='text-sm text-red-500'>{errors.balance.message}</p>
                                )}
                            </div>

                            <div className="space-y-2 flex items-center justify-between rounded-lg border p-3">
                                <div className='space-y-0.5'>
                                    <label htmlFor="isDefault" className='text-sm font-medium cursor-pointer'>Set as Default</label>
                                    <p className='text-sm text-muted-foreground'>This account will be selected by default for transactions</p>
                                </div>

                                <Switch id="isDefault" onCheckedChange={(checked) => setValue("isDefault", checked)} defaultValue={watch("isDefault")} />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <DrawerClose asChild>
                                    <Button type="button" variant="outline" className="flex-1">
                                        Cancel
                                    </Button>
                                </DrawerClose>

                                <Button type="submit" className="flex-1">
                                    Create Account
                                </Button>

                            </div>
                        </form>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default CreateAccountDrawer
