import { cn } from '../libs/utils';

function Root({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('container mx-auto p-4', className)} {...props}>
      {children}
    </div>
  );
}

function Header({
  children,
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div className={cn('mb-6', className)} {...props}>
      {children}
    </div>
  );
}

function Title({ children, className, ...props }: React.ComponentProps<'h1'>) {
  return (
    <h1 className={cn('text-3xl font-bold', className)} {...props}>
      {children}
    </h1>
  );
}

function Content({
  children,
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('grid grid-cols-1 md:grid-cols-2 gap-6', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export const AdminLayout = Object.assign(Root, {
  Header,
  Title,
  Content
});
