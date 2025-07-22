import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/datepicker.css";

interface DateInputProps {
  className?: string;
  value?: string;
  onChange?: (date: string) => void;
  required?: boolean;
  id?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
}

// Custom input component for the date picker
const CustomInput = forwardRef<HTMLDivElement, { value?: string; onClick?: () => void }>(({ value, onClick }, ref) => (
  <div 
    className="flex items-center w-full h-10 px-3 py-2 rounded-2xl border border-border/50 bg-background cursor-pointer"
    onClick={onClick}
    ref={ref}
  >
    <Calendar className="h-4 w-4 mr-2 text-muted-foreground dark:text-foreground" />
    <span className={`flex-grow ${!value ? 'text-muted-foreground' : 'text-foreground'}`}>
      {value || 'Select date...'}
    </span>
  </div>
));

CustomInput.displayName = 'CustomInput';

const DateInput = ({ className, value, onChange, required, id, name, placeholder, disabled }: DateInputProps) => {
  // Convert string date to Date object for react-datepicker
  const dateValue = value ? new Date(value) : null;
  
  // Handle date change and convert back to string format
  const handleChange = (date: Date | null) => {
    if (onChange) {
      if (date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        onChange(`${year}-${month}-${day}`);
      } else {
        onChange('');
      }
    }
  };
  
  return (
    <div className={cn("relative", className)}>
      <ReactDatePicker
        selected={dateValue}
        onChange={handleChange}
        customInput={<CustomInput />}
        dateFormat="yyyy-MM-dd"
        required={required}
        id={id}
        name={name}
        placeholderText={placeholder}
        disabled={disabled}
        className="w-full"
        calendarClassName="shadow-medium rounded-xl border border-border"
        wrapperClassName="w-full"
        popperClassName="z-50"
        showPopperArrow={false}
      />
    </div>
  );
};

export { DateInput };