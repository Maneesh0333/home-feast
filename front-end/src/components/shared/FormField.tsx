import { Input } from "../ui/input";
import { Label } from "../ui/label";

type FormFieldProps = {
  id: string;
  label: string;
  register: any;
  error?: string;
  type?: string;
  placeholder?: string;
};

export function FormField({
  id,
  label,
  register,
  error,
  type = "text",
  placeholder,
}: FormFieldProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        {...register}
        placeholder={placeholder}
        className="mt-1"
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}