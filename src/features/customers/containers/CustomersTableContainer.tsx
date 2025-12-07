"use client";

import { useGetCustomers } from "@/features/customers/hooks/queries/useGetCustomers";
import {DataTable} from "ui/dataTable";
import {columns} from "@/features/customers/components/molecules/Column";
import {Button} from "ui/button";
import {Input} from "ui/input";
import {Search} from "lucide-react";
import {useState} from "react";
import {ColumnFiltersState} from "@tanstack/react-table";

const CustomersTableContainer = () => {
    const [filters, setFilters] = useState<ColumnFiltersState>([])
    const [searchValue, setSearchValue] = useState<string>("")
    const { data: customers, isLoading, error } = useGetCustomers()

    if (isLoading) return <p>Carregando clientes...</p>

    if (error) return <p>Não foi possível carregar os clientes</p>

    return (
        <section className="container mx-auto py-10">
            <div className="flex w-full max-w-sm items-center gap-2 mb-5">
                <Input
                    type="search"
                    placeholder="Pesquisar"
                    value={searchValue}
                    onChange={({target}) => setSearchValue(target.value)}
                />
                <Button
                    type="submit"
                    variant="secondary"
                    onClick={() => setFilters([{id: "name", value: searchValue}])}
                >
                    <Search />
                </Button>
            </div>
            <div>
                <DataTable
                    columns={columns}
                    data={customers ?? []}
                    columnFilters={filters}
                    onColumnFiltersChange={setFilters}
                />
            </div>
        </section>
    )
}

export default CustomersTableContainer;