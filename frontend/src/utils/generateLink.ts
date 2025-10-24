import { v4 as uuidv4 } from "uuid";

export function generateUniqueLink(formId: string) {
  return `${window.location.origin}/form/${formId}-${uuidv4().slice(0, 8)}`;
}
