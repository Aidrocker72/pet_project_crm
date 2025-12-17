export interface IInputEmits {
  'update:modelValue': [value: string | number | undefined];
  blur: [event: FocusEvent];
}
