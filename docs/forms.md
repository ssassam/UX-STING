# Forms & validation

## Anatomy

```tsx
<Form onSubmit={save}>
  <FormErrorSummary />
  <Field name="email" label="Email" description="We never share it." required>
    <Input type="email" autoComplete="email" />
  </Field>
  <Button type="submit">Save</Button>
</Form>
```

`Field` wires ids, `aria-describedby`, `aria-invalid`, `required` and `disabled` into any control inside it (Input, Textarea, Select, Combobox, DatePicker, NumberInput, Checkbox, Switch, RadioGroup, OTPInput, Dropzone…).

## Validation, zero config

`Form` uses the browser's constraint validation (`required`, `type`, `min`, `pattern`, `minLength`…) but renders accessible inline errors instead of browser bubbles:

1. On submit, all invalid fields get errors; focus moves to `FormErrorSummary` (or the first invalid field).
2. On blur, the field re-validates — never on every keystroke.
3. `validate(values)` adds custom/async rules; `errors` merges external (server) errors.
4. `onSubmit(values)` runs only when valid; `useFormState()` exposes `submitting` for loading buttons.

## React Hook Form

Inputs forward refs and use standard props, so `register` works directly. Pass RHF errors to `Form`:

```tsx
const { register, handleSubmit, formState } = useForm();
const errors = Object.fromEntries(Object.entries(formState.errors).map(([k, v]) => [k, v?.message]));

<Form validationBehavior="none" errors={errors} onSubmit={() => handleSubmit(save)()}>
  <Field name="email" label="Email"><Input {...register("email", { required: "Email is required" })} /></Field>
</Form>
```

RHF is never required.

## Controls

| Need | Use |
| --- | --- |
| Short text | Input (+ InputGroup for addons) |
| Long text | Textarea (`autoResize`, `showCount`) |
| Numbers | NumberInput (locale-aware) |
| Password | PasswordInput |
| One of few | RadioGroup / RadioCard |
| One of many | Select, NativeSelect (mobile), Combobox (searchable) |
| Many of many | CheckboxGroup, MultiSelect |
| Free text + suggestions | Autocomplete |
| Range | Slider / RangeSlider |
| Dates & times | DatePicker, DateRangePicker, DateTimePicker, TimePicker, MonthPicker, YearPicker |
| Codes | OTPInput |
| Files | Dropzone / FileUpload |
| Settings | Switch |
