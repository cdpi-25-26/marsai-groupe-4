import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

export default function FormField({ 
  label, 
  id, 
  type = "text", 
  register, 
  required = false, 
  rows = 4,
  options = [],
  placeholder = ""
}) {
  const baseInputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  const { t } = useTranslation();
  if (type === "textarea") {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <textarea 
          id={id} 
          {...register(id)} 
          rows={rows}
          placeholder={placeholder}
          className={baseInputClass}
        />
      </div>
    );
  }

  if (type === "select") {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <select 
          id={id} 
          {...register(id)} 
          className={baseInputClass}
        >
          <option value="">{t("select_select")}{label.toLowerCase()}</option>
          {Array.isArray(options) && options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        {...register(id)}
        required={required}
        placeholder={placeholder}
        className={baseInputClass}
      />
    </div>
  );
}
