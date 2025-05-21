import { Field, FieldArray, ErrorMessage } from "formik";
import { Star, Add, Remove, Delete } from "@mui/icons-material";
import React from "react";
import "./style.css";
import { daysOfWeek } from "./constant";


const WorkingHoursFieldArray = ({ values, setFieldValue }) => {
  return (
    <div className="col-12 col-md-12 col-lg-12 mb-4">
      <div className="form-group">
        <label className="form-label">Working hours</label>
      </div>

      <FieldArray name="working_hours">
        {({ push, remove }) => (
          <div className="custom-days">
            {values.working_hours &&
              values.working_hours.map((day, index) => (
                <div
                  key={index}
                  className="custom-day-row mb-2 d-flex gap-2 align-items-start"
                >
                  {/* Day Select */}
                  <div className="w-25">
                    <Field
                      as="select"
                      name={`working_hours[${index}].day`}
                      className="form-control"
                    >
                      <option value="" disabled>
                        Select a day
                      </option>
                      {daysOfWeek.map((dayName) => (
                        <option
                          key={dayName}
                          value={dayName}
                          disabled={values.working_hours.some(
                            (item, idx) => item.day === dayName && idx !== index
                          )}
                        >
                          {dayName}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name={`working_hours[${index}].day`}
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* Start Time */}
                  <div className="w-25 d-flex align-items-center">
                    <Field
                      type="time"
                      name={`working_hours[${index}].startTime`}
                      className="form-control"
                      disabled={day.is24Hours}
                    />
                  </div>

                  {/* End Time */}
                  <div className="w-25 d-flex align-items-center">
                    <Field
                      type="time"
                      name={`working_hours[${index}].endTime`}
                      className="form-control"
                      disabled={day.is24Hours}
                    />
                  </div>

                  {/* 24 Hours Checkbox */}
                  <div className="form-check mt-2">
                    <Field
                      type="checkbox"
                      name={`working_hours[${index}].is24Hours`}
                      checked={day.is24Hours}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFieldValue(
                          `working_hours[${index}].is24Hours`,
                          checked
                        );
                        if (checked) {
                          setFieldValue(
                            `working_hours[${index}].startTime`,
                            ""
                          );
                          setFieldValue(`working_hours[${index}].endTime`, "");
                        }
                      }}
                    />
                    <label className="form-check-label ms-2">24 Hours</label>
                  </div>

                  {/* Add / Remove Buttons */}
                  <div className="d-flex flex-column mt-1">
                    {index === 0 && values.working_hours.length < 7 && (
                      <button
                        type="button"
                        onClick={() =>
                          push({
                            day: "",
                            startTime: "",
                            endTime: "",
                            is24Hours: false,
                          })
                        }
                        className="btn btn-sm btn-primary mb-2"
                      >
                        <Add />
                      </button>
                    )}
                    {values.working_hours.length > 1 && index !== 0 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="btn btn-sm btn-danger"
                      >
                        <Remove />
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </FieldArray>
    </div>
  );
};

const WorkingHoursFieldArrayWithout24Hrs = ({ values, setFieldValue }) => {
  return (
    <div className="col-12 col-md-12 col-lg-12 mb-4">
      <div className="form-group">
        <label className="form-label">Working hours</label>
      </div>

      <FieldArray name="working_hours">
        {({ push, remove }) => (
          <div className="custom-days">
            {values.working_hours &&
              values.working_hours.map((day, index) => (
                <div
                  key={index}
                  className="custom-day-row mb-2 d-flex gap-2 align-items-start"
                >
                  {/* Day Select */}
                  <div className="w-25">
                    <Field
                      as="select"
                      name={`working_hours[${index}].day`}
                      className="form-control"
                    >
                      <option value="" disabled>
                        Select a day
                      </option>
                      {daysOfWeek.map((dayName) => (
                        <option
                          key={dayName}
                          value={dayName}
                          disabled={values.working_hours.some(
                            (item, idx) => item.day === dayName && idx !== index
                          )}
                        >
                          {dayName}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name={`working_hours[${index}].day`}
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* Start Time */}
                  <div className="w-25 d-flex align-items-center">
                    <Field
                      type="time"
                      name={`working_hours[${index}].startTime`}
                      className="form-control"
                    />
                  </div>

                  {/* End Time */}
                  <div className="w-25 d-flex align-items-center">
                    <Field
                      type="time"
                      name={`working_hours[${index}].endTime`}
                      className="form-control"
                    />
                  </div>

                  {/* Add / Remove Buttons */}
                  <div className="d-flex flex-column mt-1">
                    {index === 0 && values.working_hours.length < 7 && (
                      <button
                        type="button"
                        onClick={() =>
                          push({
                            day: "",
                            startTime: "",
                            endTime: "",
                            is24Hours: false,
                          })
                        }
                        className="btn btn-sm btn-primary mb-2"
                      >
                        <Add />
                      </button>
                    )}
                    {values.working_hours.length > 1 && index !== 0 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="btn btn-sm btn-danger"
                      >
                        <Remove />
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </FieldArray>
    </div>
  );
};

export { WorkingHoursFieldArray, WorkingHoursFieldArrayWithout24Hrs };
