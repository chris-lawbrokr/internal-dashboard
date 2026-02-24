import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DatePicker, DateRangePicker } from "@/components/ui/datepicker";
import { useState } from "react";

const meta: Meta<typeof DatePicker> = {
  title: "UI/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: () => {
    const Wrapper = () => {
      const [value, setValue] = useState<Date | null>(null);
      return (
        <div className="w-[280px]">
          <DatePicker
            label="Date"
            value={value}
            onChange={setValue}
            placeholder="Pick a date"
          />
        </div>
      );
    };
    return <Wrapper />;
  },
};

export const WithValue: Story = {
  render: () => {
    const Wrapper = () => {
      const [value, setValue] = useState<Date | null>(new Date(2025, 0, 12));
      return (
        <div className="w-[280px]">
          <DatePicker
            label="Date"
            value={value}
            onChange={setValue}
          />
        </div>
      );
    };
    return <Wrapper />;
  },
};

export const DateRange: Story = {
  render: () => {
    const Wrapper = () => {
      const [start, setStart] = useState<Date | null>(null);
      const [end, setEnd] = useState<Date | null>(null);
      return (
        <div className="w-[500px]">
          <DateRangePicker
            labels={{ start: "Start Date", end: "End Date" }}
            startDate={start}
            endDate={end}
            onChange={(s, e) => { setStart(s); setEnd(e); }}
          />
        </div>
      );
    };
    return <Wrapper />;
  },
};

export const DateRangeWithValues: Story = {
  render: () => {
    const Wrapper = () => {
      const [start, setStart] = useState<Date | null>(new Date(2025, 0, 12));
      const [end, setEnd] = useState<Date | null>(new Date(2025, 1, 20));
      return (
        <div className="w-[500px]">
          <DateRangePicker
            labels={{ start: "Start Date", end: "End Date" }}
            startDate={start}
            endDate={end}
            onChange={(s, e) => { setStart(s); setEnd(e); }}
          />
        </div>
      );
    };
    return <Wrapper />;
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="w-[280px]">
      <DatePicker
        label="Date"
        value={new Date(2025, 0, 12)}
        placeholder="Pick a date"
        disabled
      />
    </div>
  ),
};
