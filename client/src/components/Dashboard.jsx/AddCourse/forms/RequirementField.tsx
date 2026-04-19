import { useEffect, useState } from "react";
import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

interface RequirementFieldProps<TForm extends FieldValues> {
  name: Path<TForm>;
  label: string;
  register: UseFormRegister<TForm>;
  errors: FieldErrors<TForm>;
  setValue: UseFormSetValue<TForm>;
  getValues: UseFormGetValues<TForm>;
}

const RequirementField = <TForm extends FieldValues>({
  name,
  label,
  register,
  errors,
  setValue,
}: RequirementFieldProps<TForm>) => {
  const [requirement, setRequirement] = useState("");
  const [requirementList, setRequirementList] = useState<string[]>([]);

  useEffect(() => {
    register(name, { required: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValue(name, requirementList as never);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requirementList]);

  const handleAddRequirement = () => {
    if (requirement) {
      setRequirementList([...requirementList, requirement]);
    }
  };

  const handleRemoveRequirement = (index: number) => {
    const updatedRequirementList = [...requirementList];
    updatedRequirementList.splice(index, 1);
    setRequirementList(updatedRequirementList);
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name}>
        {label}
        <sup>*</sup>
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          className="w-full form-style"
        />
        <button
          type="button"
          onClick={handleAddRequirement}
          className="font-semibold text-yellow-50"
        >
          Add
        </button>
      </div>

      {requirementList.length > 0 && (
        <ul>
          {requirementList.map((entry, index) => (
            <li key={index} className="flex items-center text-richblack-5">
              <span>{entry}</span>
              <button
                type="button"
                onClick={() => handleRemoveRequirement(index)}
                className="text-xs pl-4 text-red-500 text-pure-greys-300"
              >
                clear
              </button>
            </li>
          ))}
        </ul>
      )}
      {errors[name] && <span>{label} is required</span>}
    </div>
  );
};

export default RequirementField;
