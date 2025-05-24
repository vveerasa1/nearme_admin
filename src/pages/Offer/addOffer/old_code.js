<div className="form-group form-check mt-2">
<Field
  type="checkbox"
  name="type"
  checked={values.type}
  onChange={(e) => {
    handleChange(e);
    if (e.target.checked) {
      setCustomDays([
        {
          day: "",
          startTime: "12:00 AM",
          endTime: "11:59 PM",
        },
      ]);
    }
  }}
  id="custom-days-checkbox"
  className="form-check-input"
/>
<label
  htmlFor="custom-days-checkbox"
  className="form-check-label"
>
  Use Custom Days
</label>
</div>
{!values.type ? (
<div className="row">
  <div className="col-6">
    <label className="form-label">Start Time</label>
    <Field name="startTime">
      {({ field }) => (
        <select
          {...field}
          className="form-input"
          value={values.startTime}
          onChange={(e) => setFieldValue("startTime", e.target.value)}
        >
          {TIME_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.label}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  </div>
  <div className="col-6">
    <label className="form-label">End Time</label>
    <Field name="endTime">
      {({ field }) => (
        <select
          {...field}
          className="form-input"
          value={values.endTime}
          onChange={(e) => setFieldValue("endTime", e.target.value)}
        >
          {TIME_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.label}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  </div>
</div>
) : (
<div className="custom-days mt-3">
  {customDays.map((day, index) => (
<div key={index} className="custom-day-row d-flex align-items-center mb-2">
<select
className="form-input w-25"
value={day.day}
onChange={(e) => handleCustomDayChange(index, "day", e.target.value)}
>
<option value="">Select Day</option>
{["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
(d) => (
<option
key={d}
value={d}
disabled={
customDays.some((cd, i) => cd.day === d && i !== index) || disabledDays.includes(d)
}
>
{d}
</option>
)
)}
</select>

<div className="mx-2 w-25 d-flex align-items-center">
<input
type="time"
className="form-input"
value={day.startTime}
onChange={(e) => handleCustomDayChange(index, "startTime", e.target.value)}
/>
{/* <span className="ms-2">{convertTo12Hour(day.startTime)}</span> */}
</div>

<div className="w-25 d-flex align-items-center">
<input
type="time"
className="form-input"
value={day.endTime}
onChange={(e) => handleCustomDayChange(index, "endTime", e.target.value)}
/>
{/* <span className="ms-2">{convertTo12Hour(day.endTime)}</span> */}
</div>

{index === 0 ? (
<button
type="button"
onClick={handleAddDay}
className="btn btn-sm btn-outline-primary mx-2"
disabled={customDays.length >= 7}
>
<Add />
</button>
) : (
<button
type="button"
onClick={() => handleRemoveDay(index)}
className="btn btn-sm btn-outline-danger mx-2"
>
<Remove />
</button>
)}
</div>
))}
</div>
)}