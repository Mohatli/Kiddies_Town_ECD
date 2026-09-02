import React from 'react';
import { useFormContext } from 'react-hook-form';
import { AlertTriangle } from 'lucide-react';
import { EnrolmentFormValues } from './enrollmentSchemas';

interface FieldErrorProps {
  /** Dot-path of the field, e.g. "step1.firstNames" */
  name: string;
}

/**
 * Inline validation message bound to react-hook-form state.
 * Rendered directly beneath its field; announced via role="alert".
 */
export default function FieldError({ name }: FieldErrorProps) {
  const { formState: { errors } } = useFormContext<EnrolmentFormValues>();

  const message = name
    .split('.')
    .reduce<any>((acc, key) => acc?.[key], errors)?.message as string | undefined;

  if (!message) return null;

  return (
    <p role="alert" className="mt-1 flex items-center gap-1 text-[10px] font-bold text-red-600">
      <AlertTriangle className="w-3 h-3 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}
