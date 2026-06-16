export const getClassesKey = (schoolId?: string) => schoolId ? `mock_classes_${schoolId}` : "mock_classes";
export const getClassSubjectsKey = (schoolId?: string) => schoolId ? `mock_class_subjects_${schoolId}` : "mock_class_subjects";

export const DEFAULT_CLASSES: string[] = [];

export const getClasses = (schoolId?: string): string[] => {
  const data = localStorage.getItem(getClassesKey(schoolId));
  if (data) return JSON.parse(data);
  return DEFAULT_CLASSES;
};

export const saveClasses = (classes: string[], schoolId?: string) => {
  localStorage.setItem(getClassesKey(schoolId), JSON.stringify(classes));
};

export const getClassSubjects = (schoolId?: string): Record<string, string[]> => {
  const data = localStorage.getItem(getClassSubjectsKey(schoolId));
  if (data) return JSON.parse(data);
  return {};
};

export const saveClassSubjects = (mapping: Record<string, string[]>, schoolId?: string) => {
  localStorage.setItem(getClassSubjectsKey(schoolId), JSON.stringify(mapping));
};
