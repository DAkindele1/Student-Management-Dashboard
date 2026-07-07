import { useState } from 'react';
import { useClasses, useCreateClass, useDeleteClass, useUpdateClass } from '../hooks/useClasses';
import { useToast } from '../hooks/useToast';
import { Badge, Button, Card, ConfirmDialog, EmptyState, LoadingState, Modal } from '../components/ui';
import { ClassForm, type ClassFormValues } from '../features/classes/ClassForm';
import type { ClassRecord } from '../types';

const toDefaultValues = (classRecord: ClassRecord) => ({
  name: classRecord.name,
  section: classRecord.section,
  capacity: classRecord.capacity,
});

export const ClassesPage = () => {
  const { data: classes = [], isLoading } = useClasses();
  const [classToEdit, setClassToEdit] = useState<ClassRecord | null>(null);
  const [classToDelete, setClassToDelete] = useState<ClassRecord | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { showToast } = useToast();
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();
  const deleteClass = useDeleteClass();

  const handleCreate = async (values: ClassFormValues) => {
    try {
      await createClass.mutateAsync(values);
      showToast({ tone: 'success', title: 'Class created', description: `${values.name} - ${values.section} was added.` });
      setIsCreateOpen(false);
    } catch (error) {
      showToast({ tone: 'error', title: 'Create failed', description: error instanceof Error ? error.message : 'Please try again.' });
    }
  };

  const handleUpdate = async (values: ClassFormValues) => {
    if (!classToEdit) return;

    try {
      await updateClass.mutateAsync({ id: classToEdit.id, payload: values });
      showToast({ tone: 'success', title: 'Class updated', description: `${values.name} - ${values.section} was saved.` });
      setClassToEdit(null);
    } catch (error) {
      showToast({ tone: 'error', title: 'Update failed', description: error instanceof Error ? error.message : 'Please try again.' });
    }
  };

  const handleDelete = async () => {
    if (!classToDelete) return;

    try {
      await deleteClass.mutateAsync(classToDelete.id);
      showToast({ tone: 'success', title: 'Class deleted', description: `${classToDelete.name} - ${classToDelete.section} was removed.` });
      setClassToDelete(null);
    } catch (error) {
      showToast({ tone: 'error', title: 'Delete failed', description: error instanceof Error ? error.message : 'Please try again.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Classes</h2>
          <p className="mt-1 text-sm text-slate-500">Create and maintain the class roster structure.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>Add Class</Button>
      </div>

      {isLoading ? (
        <LoadingState label="Loading classes..." />
      ) : classes.length === 0 ? (
        <EmptyState title="No classes found" description="Create the first class to begin enrolling students." action={<Button onClick={() => setIsCreateOpen(true)}>Create class</Button>} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {classes.map((classRecord) => (
            <Card key={classRecord.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{classRecord.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">Section {classRecord.section}</p>
                </div>
                <Badge tone="sky">{classRecord._count?.students ?? 0} students</Badge>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-slate-500">Capacity</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">{classRecord.capacity}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-slate-500">Enrolled</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">{classRecord._count?.students ?? 0}</div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => setClassToEdit(classRecord)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => setClassToDelete(classRecord)}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={isCreateOpen} title="Create Class" description="Add a new class and its seating capacity." onClose={() => setIsCreateOpen(false)}>
        <ClassForm
          title="New Class"
          description="Use a clear name and section so it can be assigned to students."
          submitLabel="Create Class"
          onCancel={() => setIsCreateOpen(false)}
          onSubmit={handleCreate}
          isSubmitting={createClass.isPending}
        />
      </Modal>

      <Modal open={Boolean(classToEdit)} title="Edit Class" description="Update the class details." onClose={() => setClassToEdit(null)}>
        {classToEdit ? (
          <ClassForm
            title={classToEdit.name}
            description="Modify the class record and save your changes."
            defaultValues={toDefaultValues(classToEdit)}
            submitLabel="Save Changes"
            onCancel={() => setClassToEdit(null)}
            onSubmit={handleUpdate}
            isSubmitting={updateClass.isPending}
          />
        ) : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(classToDelete)}
        title="Delete class"
        description={`Deleting ${classToDelete?.name ?? 'this class'} will also remove assigned students because of the cascade relation.`}
        onClose={() => setClassToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};