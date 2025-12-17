export interface IInputProps {
  id?: string;
  modelValue: string | number | undefined;
  label?: string;
  placeholder?: string;
  type?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  error?: string;
}
