"use client"

import * as React from "react"
import {Bar, BarChart, Label, LabelList, XAxis, YAxis} from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/shared/components/ui/chart"

const chartData = [
    { category: "chrome", value: 275, fill: "var(--color-chrome)" },
    { category: "safari", value: 200, fill: "var(--color-safari)" },
    { category: "firefox", value: 287, fill: "var(--color-firefox)" }
]

const chartConfig = {
    chrome: {
        label: "Açucar",
        color: "var(--chart-1)",
    },
    safari: {
        label: "Frutas",
        color: "var(--chart-2)",
    },
    firefox: {
        label: "Doces",
        color: "var(--chart-3)",
    },
    edge: {
        label: "Edge",
        color: "var(--chart-4)",
    },
    other: {
        label: "Other",
        color: "var(--chart-5)",
    },
} satisfies ChartConfig

const DashboardPieChart = () => {
    const totalValue = chartData
        .reduce((acc, {value}) => acc + value, 0);

    const chartDataWithPercent = chartData.map((item) => ({
        ...item,
        percent: ((item.value / totalValue) * 100).toFixed(1) + "%",
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Despesas por categoria</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartDataWithPercent}
                        layout="vertical"
                        margin={{
                            left: 0,
                        }}
                    >
                        <YAxis
                            dataKey="category"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) =>
                                chartConfig[value as keyof typeof chartConfig]?.label
                            }
                        />
                        <XAxis dataKey="value" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent nameKey="category" hideIndicator hideLabel />}
                        />
                        <Bar dataKey="value" layout="vertical" radius={5}>
                            <LabelList
                                dataKey="percent"
                                position="insideLeft"
                                offset={8}
                                className="fill-(--color-label)"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default DashboardPieChart
