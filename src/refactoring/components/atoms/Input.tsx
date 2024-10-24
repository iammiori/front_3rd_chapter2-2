export interface InputProps {
  id?: string;
  type: 'text' | 'number';
  value: string | number;
  onChange: (value: any) => void;
  placeholder?: string;
  className?: string;
}

const BASE_CSS = 'w-full p-2 border rounded';
export const Input = ({
  id,
  type,
  value,
  onChange,
  placeholder,
  className
}: InputProps) => {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${BASE_CSS} ${className}`}
    />
  );
};
