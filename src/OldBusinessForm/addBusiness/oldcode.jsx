<div className="custom-days">
{workingHours.map((day, index) => (
  <div
    key={index}
    className="custom-day-row mb-2 d-flex gap-2"
  >
    {/* Day Selection */}
    <Field
      as="select"
      name={`working_hours[${index}].day`}
      value={day.day}
      onChange={(e) =>
        handleWorkingHoursChange(
          index,
          "day",
          e.target.value
        )
      }
      className="form-control w-25"
    >
      <option value="" disabled>
        Select a day
      </option>
      {[
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ].map((dayName) => (
        <option
          key={dayName}
          value={dayName}
          disabled={workingHours.some(
            (item, idx) =>
              item.day === dayName && idx !== index
          )}
        >
          {dayName}
        </option>
      ))}
    </Field>

    {/* Start Time */}
    <Field
      className="form-control w-25"
      type="time"
      placeholder="Start Time"
      value={day.startTime}
      disabled={day.is24Hours}
      onChange={(e) =>
        handleWorkingHoursChange(
          index,
          "startTime",
          e.target.value
        )
      }
    />

    <Field
      className="form-control w-25"
      type="time"
      placeholder="End Time"
      value={day.endTime}
      disabled={day.is24Hours}
      onChange={(e) =>
        handleWorkingHoursChange(
          index,
          "endTime",
          e.target.value
        )
      }
    />

    {/* 24 Hours Checkbox */}
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        checked={day.is24Hours}
        onChange={(e) =>
          handleWorkingHoursChange(
            index,
            "is24Hours",
            e.target.checked
          )
        }
      />

      <label
        className="form-check-label ms-2"
        htmlFor={`24hours-${index}`}
      >
        24 Hours
      </label>
    </div>

    {index === 0 && workingHours.length < 7 && (
      <button
        type="button"
        onClick={handleAddDay}
        className="btn btn-sm btn-primary p-1 mb-1 px-2"
      >
        <Add />
      </button>
    )}
    {workingHours.length > 1 && index !== 0 && (
      <button
        type="button"
        onClick={() => handleRemoveDay(index)}
        className="btn btn-sm btn-danger p-1 mb-1 px-2"
      >
        <Remove />
      </button>
    )}
  </div>
))}
</div>