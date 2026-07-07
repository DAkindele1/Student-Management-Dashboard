import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormError, Input, Label } from '../../components/ui';

const schema = z.object({
  name: z.string().min(1, 'Class name is required'),
  section: z.string().min(1, 'Section is required'),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1'),
});

export type ClassFormValues = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<ClassFormValues>;
  onSubmit: (values: ClassFormValues) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel: string;
  title: string;
  description?: string;
}

export const ClassForm = ({ defaultValues, onSubmit, onCancel, isSubmitting, submitLabel, title, description }: Props) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClassFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      section: '',
      capacity: 30,
      ...defaultValues,
    },
  });

  useEffect(() => {
    reset({
      name: '',
      section: '',
      capacity: 30,
      ...defaultValues,
    });
  }, [defaultValues, reset]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Label>Class Name</Label>
          <Input {...register('name')} />
          <FormError message={errors.name?.message} />
        </div>
        <div>
          <Label>Section</Label>
          <Input {...register('section')} />
          <FormError message={errors.section?.message} />
        </div>
        <div>
          <Label>Capacity</Label>
          <Input type="number" min={1} {...register('capacity', { valueAsNumber: true })} />
          <FormError message={errors.capacity?.message} />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};