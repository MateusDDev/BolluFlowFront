"use client"

import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
} from "ui/chart";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "ui/card";
import {TrendingUp} from "lucide-react";
import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts";

const chartData = [
    { month: "Janeiro", revenues: 175.70, expenses: 80 },
    { month: "Fevereiro", revenues: 305, expenses: 200 },
    { month: "Março", revenues: 237, expenses: 120 },
    { month: "Abril", revenues: 73, expenses: 190 },
    { month: "Maio", revenues: 209, expenses: 130 },
    { month: "Junho", revenues: 214, expenses: 140 },
]

const chartConfig = {
    revenues: {
        label: "Receitas",
        color: "var(--chart-1)",
    },
    expenses: {
        label: "Despesas",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

const EntriesChart = () => {
    return(
        <Card>
            <CardHeader>
                <CardTitle>Entradas e saídas</CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis
                            width={75}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => value.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            })}
                        />
                        <ChartTooltip content={<ChartTooltipContent hideIndicator={true} />}/>
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="revenues" fill="var(--color-revenues)" radius={4} />
                        <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Aumento de 5.2% esse mês em relação ao mês anterior <TrendingUp className="h-4 w-4" />
                </div>
                {/*<div className="text-muted-foreground leading-none">*/}
                {/*    Showing total visitors for the last 6 months*/}
                {/*</div>*/}
            </CardFooter>
        </Card>
    )
}

export default EntriesChart