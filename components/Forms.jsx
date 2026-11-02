"use client";
import { useEffect, useRef, useState } from "react";
import { SCRIED_AGES, SCRIED_LEVELS } from "@/data/content";
import { Store } from "@/lib/store";
/* ------------------------------------------------------------------
   Form helpers (ported from UI.field / UI.check / UI.profileFields /
   UI.showErrors). Inputs stay uncontrolled, like the original: values are
   read from the form on submit (see formData in lib/ui.ts).
   ------------------------------------------------------------------ */
/** Holds field errors for a form and scrolls/focuses the first problem, as UI.showErrors did. */
export function useFormErrors() {
  const [errors, setErrorsState] = useState({});
  const [tick, setTick] = useState(0);
  const formRef = useRef(null);
  const setErrors = (e) => {
    setErrorsState(e);
    setTick((t) => t + 1);
  };
  useEffect(() => {
    if (!tick) return;
    const form = formRef.current;
    if (!form) return;
    let firstEl = null;
    for (const k of Object.keys(errors)) {
      const f = form.querySelector(`[data-field="${k}"]`);
      if (f) {
        firstEl = firstEl || f;
      }
    }
    if (firstEl) {
      firstEl.scrollIntoView({ behavior: "smooth", block: "center" });
      const i = firstEl.querySelector("input, select, textarea");
      if (i) i.focus({ preventScroll: true });
    } else if (errors.form) {
      form.querySelector(".form-error")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);
  return { errors, setErrors, formRef };
}
/** The red message at the top of a form. */
export function FormError({ message }) {
  return (
    <p className="err form-error" hidden={!message}>
      {message || ""}
    </p>
  );
}
export function Field({
  name,
  label,
  type = "text",
  value = "",
  help = "",
  optional = false,
  options = null,
  placeholder = "",
  prefix = "f-",
  error,
  autoComplete,
  autoFocus,
  disabled,
  inputProps
}) {
  const id = prefix + name;
  let input;
  if (options)
    input = (
      <select id={id} name={name} defaultValue={value} autoComplete={autoComplete} disabled={disabled}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    );
  else if (type === "textarea") input = <textarea id={id} name={name} rows={3} defaultValue={value} placeholder={placeholder} />;
  else
    input = (
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        disabled={disabled}
        {...inputProps}
      />
    );
  return (
    <div className={"field" + (error ? " has-error" : "")} data-field={name}>
      <label htmlFor={id}>
        {label}
        {optional && (
          <>
            {" "}
            <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span>
          </>
        )}
      </label>
      {input}
      {help && <p className="help">{help}</p>}
      <p className="err" hidden={!error}>
        {error || ""}
      </p>
    </div>
  );
}
export function Check({ name, label, checked = false, error, onChange }) {
  return (
    <div className={"field" + (error ? " has-error" : "")} data-field={name}>
      <label className="check" htmlFor={"f-" + name}>
        <input
          type="checkbox"
          id={"f-" + name}
          name={name}
          defaultChecked={checked}
          onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
        />{" "}
        <span>{label}</span>
      </label>
      <p className="err" hidden={!error}>
        {error || ""}
      </p>
    </div>
  );
}
export function ProfileFields({ values = {}, lockEmail = false, errors = {} }) {
  const schoolOpts = Store.schools().map((s) => [s.id, s.short ? `${s.name} (${s.short})` : s.name]);
  const v = values;
  return (
    <>
      <Field
        name="fullName"
        label="Full name (as it should appear on certificates)"
        value={v.fullName}
        help="Check the spelling. This is the name certificates and reports will use."
        autoComplete="name"
        error={errors.fullName}
      />
      <div className="row">
        <Field name="email" label="Email" type="email" value={v.email} disabled={lockEmail} autoComplete="email" error={errors.email} />
        <Field
          name="phone"
          label="WhatsApp number"
          type="tel"
          value={v.phone}
          placeholder="e.g. 0803 000 0000"
          autoComplete="tel"
          error={errors.phone}
        />
      </div>
      <Field name="school" label="School" value={v.school} options={schoolOpts} placeholder="Choose your school" error={errors.school} />
      <Field name="schoolOther" label="School not listed? Type it here" value={v.schoolOther} optional error={errors.schoolOther} />
      <Field name="course" label="Course" value={v.course} placeholder="e.g. Computer Science" error={errors.course} />
      <div className="row">
        <Field name="level" label="Level" value={v.level} options={SCRIED_LEVELS} placeholder="Choose your level" error={errors.level} />
        <Field name="age" label="Age range" value={v.age} options={SCRIED_AGES} placeholder="Choose your age range" error={errors.age} />
      </div>
    </>
  );
}
