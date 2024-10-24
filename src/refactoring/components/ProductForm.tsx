import { cn } from '../libs/utils';

function Root({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('bg-white p-4 rounded shadow', className)} {...props}>
      {children}
    </div>
  );
}

function Field({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

function Label({
  children,
  className,
  ...props
}: React.ComponentProps<'label'>) {
  return (
    <label
      className={cn('block text-sm font-medium text-gray-700 mb-1', className)}
      {...props}
    >
      {children}
    </label>
  );
}

export const ProductForm = Object.assign(Root, {
  Field,
  Label
});
