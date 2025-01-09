"use client";

import {BarChart, XAxis, YAxis, ResponsiveContainer, Bar} from "recharts";

const Charts = ({
  data: {salesData},
}: {
  data: {salesData: {month: string; totalSales: number}[]};
}) => {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={salesData}>
        <XAxis dataKey='month' stroke='#888888' fontSize={12} axisLine={true} tickLine={false} />
        <YAxis
          stroke='#888888'
          fontSize={12}
          axisLine={true}
          tickLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey='totalSales'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Charts;
