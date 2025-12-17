export interface IModalProps {
  isOpen: boolean;
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  closeButtonLabel?: string;
}
