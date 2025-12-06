"use client";

import { useGetCustomers } from "@/features/customers/hooks/queries/useGetCustomers";
import {DataTable} from "ui/dataTable";
import {columns} from "@/features/customers/components/molecules/Column";
import {Button} from "ui/button";
import {Input} from "ui/input";
import {Search} from "lucide-react";

const CustomersTableContainer = () => {
    const { data: customers, isLoading, error, refetch } = useGetCustomers()

    if (isLoading) return <p>Carregando clientes...</p>

    if (error) return <p>Não foi possível carregar os clientes</p>

    return (
        <section className="container mx-auto py-10">
            <div className="flex w-full max-w-sm items-center gap-2 mb-5">
                <Input type="search" placeholder="Pesquisar" />
                <Button type="submit" variant="secondary">
                    <Search />
                </Button>
            </div>
            <div>
                <DataTable columns={columns} data={customers ?? []} />
            </div>
        </section>
    )
}

export default CustomersTableContainer;