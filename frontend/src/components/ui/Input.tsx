import {
  forwardRef,
  type InputHTMLAttributes,
} from "react";

type InputProps =
  InputHTMLAttributes<HTMLInputElement> & {
    label?: string;

    error?: string;
  };

const Input = forwardRef<
  HTMLInputElement,
  InputProps
>(
  (
    {
      label,
      error,
      className = "",
      ...props
    },

    ref,
  ) => {
    return (
      <div className="space-y-1.5">
        {label ? (
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </label>
        ) : null}

        <input
          ref={ref}
          className={`
            w-full
            rounded-xl
            border
            border-slate-300
            dark:border-slate-600
            bg-white
            dark:bg-slate-800
            px-4
            py-2.5
            text-sm
            text-slate-800
            dark:text-slate-100
            placeholder:text-slate-400
            dark:placeholder:text-slate-500
            outline-none
            transition
            focus:border-primary
            focus:ring-2
            focus:ring-primary/20
            ${error ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""}
            ${className}
          `}
          {...props}
        />

        {error ? (
          <p className="text-sm text-danger">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;