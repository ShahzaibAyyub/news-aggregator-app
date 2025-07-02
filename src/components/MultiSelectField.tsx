import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import Select from "react-select";

interface FilterOption {
  value: string;
  label: string;
}

interface MultiSelectFieldProps {
  name: string;
  control: Control<any>;
  options: FilterOption[];
  label: string;
  placeholder: string;
  helpText?: string;
  isLoading?: boolean;
}

const customSelectStyles = {
  control: (provided: any) => ({
    ...provided,
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    minHeight: "2.5rem",
    "&:hover": {
      borderColor: "#ef4444",
    },
    "&:focus-within": {
      borderColor: "#ef4444",
      boxShadow: "0 0 0 2px rgba(239, 68, 68, 0.2)",
    },
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: "#fee2e2",
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: "#dc2626",
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: "#dc2626",
    "&:hover": {
      backgroundColor: "#dc2626",
      color: "white",
    },
  }),
};

export default function MultiSelectField({
  name,
  control,
  options,
  label,
  placeholder,
  helpText,
  isLoading = false,
}: MultiSelectFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            isMulti
            isClearable
            isLoading={isLoading}
            placeholder={placeholder}
            styles={customSelectStyles}
            onChange={(selected) => {
              field.onChange(selected || []);
            }}
          />
        )}
      />
      {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    </div>
  );
}
