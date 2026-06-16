import { User, GraduationCap, Users, MapPin, Lock } from "lucide-react";

import type {
  UseFormHandleSubmit,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";

import Input from "@/components/ui/Input";
import FormError from "@/components/ui/FormError";
import ModalActions from "@/components/ui/ModalAction";

import type { StudentFormValues } from "../schemas/studentSchema";
import { getClasses } from "../services/class-subjects.service";
import { useAuthStore } from "@/features/auth/store/authStore";

type StudentFormProps = {
  register: UseFormRegister<StudentFormValues>;
  errors: FieldErrors<StudentFormValues>;
  handleSubmit: UseFormHandleSubmit<StudentFormValues, any>;
  onSubmit: (values: StudentFormValues) => void;
  onCancel: () => void;
  isEditing: boolean;
};

/* ─── section divider ─── */
function SectionLabel({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="col-span-1 sm:col-span-2 flex items-center gap-2 pt-2 pb-1">
      <Icon className="h-4 w-4 text-primary" />
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </h3>
      <div className="flex-1 border-b border-slate-200 dark:border-slate-700" />
    </div>
  );
}

function StudentForm({
  register,
  errors,
  handleSubmit,
  onSubmit,
  onCancel,
  isEditing,
}: StudentFormProps) {
  const { user } = useAuthStore();
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
        {/* ═══════ PERSONAL INFO ═══════ */}
        <SectionLabel icon={User} label="Personal Information" />

        <div>
          <Input
            label="First Name"
            placeholder="e.g. Rahul"
            {...register("firstName")}
          />
          <FormError message={errors.firstName?.message} />
        </div>

        <div>
          <Input
            label="Last Name"
            placeholder="e.g. Sharma"
            {...register("lastName")}
          />
          <FormError message={errors.lastName?.message} />
        </div>

        <div>
          <Input
            label="Email"
            type="email"
            placeholder="student@example.com"
            {...register("email")}
          />
          <FormError message={errors.email?.message} />
        </div>

        <div>
          <Input
            label="Phone"
            type="tel"
            placeholder="+91 98765 43210"
            {...register("phone")}
          />
          <FormError message={errors.phone?.message} />
        </div>

        {/* ═══════ ACADEMIC ═══════ */}
        <SectionLabel icon={GraduationCap} label="Academic Details" />

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Class
          </label>
          <select
            {...register("className")}
            className={`
              w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer
              ${errors.className ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""}
            `}
          >
            <option value="">Select a class</option>
            {getClasses(user?.schoolId).map((cls) => (
              <option key={cls} value={cls}>
                Class {cls}
              </option>
            ))}
          </select>
          <FormError message={errors.className?.message} />
        </div>

        <div>
          <Input
            label="Roll Number"
            placeholder="e.g. 42"
            {...register("rollNumber")}
          />
          <FormError message={errors.rollNumber?.message} />
        </div>

        {/* ═══════ FAMILY ═══════ */}
        <SectionLabel icon={Users} label="Family Details" />

        <div>
          <Input
            label="Father's Name"
            placeholder="Optional"
            {...register("fatherName")}
          />
          <FormError message={errors.fatherName?.message} />
        </div>

        <div>
          <Input
            label="Mother's Name"
            placeholder="Optional"
            {...register("motherName")}
          />
          <FormError message={errors.motherName?.message} />
        </div>

        <div>
          <Input
            label="Father's Phone"
            type="tel"
            placeholder="Optional"
            {...register("fatherPhone")}
          />
          <FormError message={errors.fatherPhone?.message} />
        </div>

        <div>
          <Input
            label="Mother's Phone"
            type="tel"
            placeholder="Optional"
            {...register("motherPhone")}
          />
          <FormError message={errors.motherPhone?.message} />
        </div>

        {/* ═══════ ADDRESS ═══════ */}
        <SectionLabel icon={MapPin} label="Address" />

        <div className="sm:col-span-2">
          <Input
            label="Full Address"
            placeholder="House no., Street, City, State, PIN"
            {...register("address")}
          />
          <FormError message={errors.address?.message} />
        </div>

        {/* ═══════ SECURITY ═══════ */}
        <SectionLabel icon={Lock} label="Security" />

        <div className="sm:col-span-2">
          <Input
            label="Password"
            type="password"
            placeholder={
              isEditing ? "Leave blank to keep current" : "Min 6 characters"
            }
            {...register("password")}
          />
          <FormError message={errors.password?.message} />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-6">
        <ModalActions
          submitLabel={isEditing ? "Update Student" : "Save Student"}
          onCancel={onCancel}
        />
      </div>
    </form>
  );
}

export default StudentForm;
