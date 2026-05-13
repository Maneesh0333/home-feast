"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type Props = {
  data?: {
    date: string;
    amount: number;
  }[];
};

export default function ChartBar({ data = [] }: Props) {
  const chartData = data.map((item) => ({
    label: item.date,
    earnings: item.amount,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold">Earnings Overview</CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={{
            earnings: {
              label: "Earnings",
              color: "var(--chart-1)",
            },
          }}
        >
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <Bar
              dataKey="earnings"
              fill="var(--color-earnings)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="text-sm text-muted-foreground">
        Last 7 days performance
      </CardFooter>
    </Card>
  );
}