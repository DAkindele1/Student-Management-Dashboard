import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormError, Input, Label, Select, Textarea } from '../../components/ui';
import type { ClassRecord, Gender, StudentRecord } from '../../types';

const schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(6, 'Phone number is required'),
  gender: z.enum(['MALE', 'FEMALE']),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  classId: z.string().min(1, 'Assigned class is required'),
});

export type StudentFormValues = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<StudentFormValues>;
  classes: ClassRecord[];
  onSubmit: (values: StudentFormValues) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel: string;
  title: string;
  description?: string;
}

export const StudentForm = ({ defaultValues, classes, onSubmit, onCancel, isSubmitting, submitLabel, title, description }: Props) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<StudentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      gender: 'MALE',
      dateOfBirth: '',
      classId: '',
      ...defaultValues,
    },
  });

  useEffect(() => {
    reset({
      fullName: '',
      email: '',
      phone: '',
      gender: 'MALE',
      dateOfBirth: '',
      classId: '',
      ...defaultValues,
    });
  }, [defaultValues, reset]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Full Name</Label>
          <Input {...register('fullName')} />
          <FormError message={errors.fullName?.message} />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" {...register('email')} />
          <FormError message={errors.email?.message} />
        </div>
        <div>
          <Label>Phone Number</Label>
          <Input {...register('phone')} />
          <FormError message={errors.phone?.message} />
        </div>
        <div>
          <Label>Gender</Label>
          <Select {...register('gender')}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </Select>
          <FormError message={errors.gender?.message} />
        </div>
        <div>
          <Label>Date of Birth</Label>
          <Input type="date" {...register('dateOfBirth')} />
          <FormError message={errors.dateOfBirth?.message} />
        </div>
        <div>
          <Label>Assigned Class</Label>
          <Select {...register('classId')}>
            <option value="">Select a class</option>
            {classes.map((classRecord) => (
              <option key={classRecord.id} value={classRecord.id}>
                {classRecord.name} - {classRecord.section}
              </option>
            ))}
          </Select>
          <FormError message={errors.classId?.message} />
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