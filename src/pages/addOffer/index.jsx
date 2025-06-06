import { useRef, useState } from "react";
import "./style.css";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Add, Remove, Delete } from "@mui/icons-material";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isBetween from "dayjs/plugin/isBetween";
import axiosInstance from "../../interceptors/axiosInstance";

import { Toaster, toast } from "react-hot-toast";

dayjs.extend(weekday);
dayjs.extend(isBetween);

// const convertTo12Hour = (time24) => {
//   if (!time24) return "";
//   const [hours, minutes] = time24.split(':');
//   const parsedHours = parseInt(hours, 10);
//   const period = parsedHours >= 12 ? 'PM' : 'AM';
//   const hours12 = parsedHours % 12 || 12; // Handle 00:00 as 12 AM
//   return `${hours12}:${minutes} ${period}`;
// };
let allWeekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const convertTo12Hour = (time24) => {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":");
  const parsedHours = parseInt(hours, 10);
  const period = parsedHours >= 12 ? "PM" : "AM";
  const hours12 = parsedHours % 12 || 12;
  return `${hours12}:${minutes} ${period}`;
};

const convertTo24Hour = (time12) => {
  // expects: "1:15 PM" or "01:15 AM"
  if (!time12) return "";
  let [time, modifier] = time12.split(" ");
  let [hours, minutes] = time.split(":");
  hours = parseInt(hours, 10);

  if (modifier === "PM" && hours !== 12) {
    hours = hours + 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
};

const TIME_OPTIONS = (() => {
  // Generate time options for dropdown
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      options.push(`${hh}:${mm}`);
    }
  }
  return options.map((t) => ({
    value: t,
    label: convertTo12Hour(t),
  }));
})();

const { RangePicker } = DatePicker;

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required").min(3),
  description: Yup.string().required("Description is required"),
  couponDescription: Yup.string().required("Coupon details is required").min(5),
  discountType: Yup.string()
    .required("Discount type is required")
    .oneOf(["Deal", "Discount", "Coupon"]),
  type: Yup.boolean(),
  endTime: Yup.string().when("type", {
    is: false,
    then: (schema) =>
      schema
        .notRequired()
        .test(
          "is-greater",
          "End time must be greater than start time",
          function (value) {
            const { startTime } = this.parent;
            return !startTime || !value || value > startTime;
          }
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const AddOffer = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const SUPPORTED_FORMATS = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/svg+xml",
  ];
  const [photoError, setPhotoError] = useState("");
  // const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  // const MAX_IMAGES = 5;
  const [customDays, setCustomDays] = useState([
    { day: "", startTime: "00:01", endTime: "23:59" },
  ]);
  const fileInputRef = useRef(null);
  // const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const [range, setRange] = useState([dayjs(), dayjs()]);
  const [disabledDays, setDisabledDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setPhotos] = useState(null);
  const hostUrl = import.meta.env.VITE_BASE_URL;

  // const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/jpg"];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const MAX_IMAGES = 5;

  const { _id } = useParams();

  // const resizeImage = (file, width, height) => {
  //   return new Promise((resolve, reject) => {
  //     const img = new Image();
  //     const reader = new FileReader();

  //     reader.onload = (e) => {
  //       img.src = e.target.result;
  //     };

  //     img.onload = () => {
  //       const canvas = document.createElement("canvas");
  //       const ctx = canvas.getContext("2d");

  //       canvas.width = width;
  //       canvas.height = height;
  //       ctx.drawImage(img, 0, 0, width, height);

  //       canvas.toBlob(
  //         (blob) => resolve(new File([blob], file.name, { type: file.type })),
  //         file.type,
  //         1
  //       );
  //     };

  //     img.onerror = (err) => reject(err);

  //     reader.readAsDataURL(file);
  //   });
  // };

  const handleFileChange = async (e) => {
    const input = e.target;

    const files = Array.from(input.files);
    let error = "";

    if (files.length + (images?.length || 0) > MAX_IMAGES) {
      error = `You can upload a maximum of ${MAX_IMAGES} images.`;
    }

    const resizedImages = [];

    for (const file of files) {
      if (!SUPPORTED_FORMATS.includes(file.type)) {
        error = "Only JPEG, PNG, GIF, and SVG formats are allowed.";
        break;
      } else if (file.size > MAX_FILE_SIZE) {
        error = "Each file must not exceed 5 MB.";
        break;
      } else {
        try {
          const resizedImage = await resizeImage(file, 800, 600);
          resizedImages.push(resizedImage);
        } catch (err) {
          error = err;
          break;
        }
      }
    }

    if (error) {
      setPhotoError(error);
    } else {
      setPhotoError("");
      setPhotos((prevPhotos) => [...(prevPhotos || []), ...resizedImages]);
    }

    // 🔑 Reset file input so selecting same file again will trigger onChange
    input.value = "";
  };

  // Checks original image dimensions before processing
  const checkImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width < 800 || img.height < 600) {
          reject("Image must be at least 800x600 pixels.");
        } else {
          resolve();
        }
      };
      img.onerror = () => reject("Could not read image dimensions.");
    });
  };

  // Resizes image to the required dimensions (800x600)
  const resizeImage = (file, width, height) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            const newFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(newFile);
          }, file.type);
        };
        img.onerror = reject;
        img.src = event.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove) => {
    setPhotos((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  // This handles both time and day change for customDays
  const handleCustomDayChange = (index, field, value) => {
    const updated = [...customDays];
    updated[index][field] = value;

    const start = dayjs(updated[index].startTime, "HH:mm"); // 24-hour format
    const end = dayjs(updated[index].endTime, "HH:mm");

    if (start.isValid() && end.isValid() && end.isBefore(start)) {
      toast.error("End time should be greater than start time.");
      updated[index].endTime = "23:59"; // reset to default valid time
    }

    setCustomDays(updated);
  };

  const handleAddDay = () => {
    if (customDays.length >= 7) {
      toast.error("You can only add up to 7 days.");
      return;
    }

    const lastDay = customDays[customDays.length - 1];
    if (!lastDay.day) {
      toast.error("Please select a day before adding another.");
      return;
    }

    setCustomDays([
      ...customDays,
      {
        day: "",
        startTime: "00:01", // 24-hour format
        endTime: "23:59",
      }, // set defaults
    ]);
  };

  const handleRemoveDay = (index) => {
    const updatedDays = [...customDays];
    updatedDays.splice(index, 1);
    setCustomDays(updatedDays);
  };

  const disablePastDates = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const handleRangeChange = (dates) => {
    if (dates) {
      const start = dayjs(dates[0]);
      const end = dayjs(dates[1]);
      setRange(start.isAfter(end) ? [end, start] : [start, end]);

      if (start.month() === end.month() && start.year() === end.year()) {
        const daysInRange = [];
        for (
          let d = start;
          d.isBefore(end) || d.isSame(end);
          d = d.add(1, "day")
        ) {
          const weekday = d.format("dddd");
          if (!daysInRange.includes(weekday)) daysInRange.push(weekday);
        }
        setDisabledDays(
          allWeekdays.filter((day) => !daysInRange.includes(day))
        );
      } else {
        setDisabledDays([]);
      }
    } else {
      setRange([null, null]);
      setDisabledDays([]);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const handleSubmit = async (values, formikHelpers = {}) => {
    // const { resetForm } = formikHelpers;
    setLoading(true);

    let daysToSubmit = values.type
      ? customDays
          .map((d) => ({
            ...d,
            startTime: d.startTime,
            endTime: d.endTime,
          }))
          .sort(
            (a, b) => allWeekdays.indexOf(a.day) - allWeekdays.indexOf(b.day)
          )
      : [];

    if (
      values.type &&
      (!daysToSubmit.length ||
        daysToSubmit.some((day) => !day.day || !day.startTime || !day.endTime))
    ) {
      toast.error("Please complete all custom day fields.");
      setLoading(false);
      return;
    }

    if (images.length === 0) {
      setImageError("Please upload at least one image.");
      setLoading(false);
      return;
    }
    // console.log('Hi hello' ,formatDate(range[0]) , formatDate(range[1]) , convertTo24Hour(values.startTime));
    // return;
    const formData = new FormData();
    formData.append("place_Id", _id);
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("couponDescription", values.couponDescription);
    formData.append("discountType", values.discountType);
    formData.append("type", values.type);
    formData.append("startDate", range[0].format("YYYY-MM-DD"));
    formData.append("endDate", range[1].format("YYYY-MM-DD"));

    if (values.type) {
      formData.append("customDays", JSON.stringify(daysToSubmit));
    } else {
      formData.append("startTime", convertTo24Hour(values.startTime));
      formData.append("endTime", convertTo24Hour(values.endTime));
    }

    if (values.discountType === "Discount" || values.discountType === "Deal") {
      formData.append("discountValue", values.discountValue);
    }

    images.forEach((file) => formData.append("images", file));
    // console.log(formatDate(range[0]), formatDate(range[1]));
    // console.log(range[0].format("YYYY-MM-DD"), range[1].format("YYYY-MM-DD"));

    //     return;

    try {
      const response = await axiosInstance.post(`coupons/`, formData);
      toast.success(`${values.discountType} Created Successfully`);
      // resetForm();
      // setCustomDays([{ day: "", startTime: "12:01 AM", endTime: "11:59 PM" }]);
      // // setImages([]);
      // setRange([dayjs(), dayjs()]);
      // setDisabledDays([]);
      // if (fileInputRef.current) fileInputRef.current.value = null;
      // toast.success(`${values.discountType.trim()} created sucessfully`);
      if (values.discountType === "Discount") {
        navigate("/discounts");
      } else if (values.discountType === "Deal") {
        navigate("/deals");
      } else {
        navigate("/coupons");
      }
    } catch (err) {
      // toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-wrapper">
      <Toaster position="bottom-center" />
      <div className="breadcrumb-wrapper">
        <div className="breadcrumb-block">
          <h2 className="page-heading">Add Offer</h2>
          <ul className="breadcrumb-list">
            <li className="breadcrumb-item">
              <Link to={"/dashboard"} className="breadcrumb-link">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <span className="breadcrumb-link">Offer</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="form-container">
        <Formik
          initialValues={{
            title: "",
            description: "",
            discountType: "",
            discountValue: "",
            couponDescription: "",
            type: false,
            startDate: new Date(),
            endDate: new Date(),
            startTime: "00:01", // 12:01 AM
            endTime: "23:59", // 11:59 PM
            customDays: [{ day: "", startTime: "00:01", endTime: "23:59" }],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, setFieldValue }) => (
            <Form className="form-wrapper">
              <div className="row">
                {/* Left Column */}
                <div className="col-12 col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Title</label>
                    <Field
                      name="title"
                      className="form-input"
                      placeholder="Enter title here"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="error text-danger"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">How to use</label>
                    <Field
                      as="textarea"
                      name="description"
                      className="form-input"
                      rows={3}
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="error text-danger"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Coupon Details</label>
                    <Field
                      as="textarea"
                      name="couponDescription"
                      className="form-input"
                      rows={3}
                    />
                    <ErrorMessage
                      name="couponDescription"
                      component="div"
                      className="error text-danger"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Offer Type</label>
                    <Field
                      as="select"
                      name="discountType"
                      className="form-input"
                    >
                      <option value="">Select Offer</option>
                      <option>Deal</option>
                      <option>Discount</option>
                      <option>Coupon</option>
                    </Field>
                    <ErrorMessage
                      name="discountType"
                      component="div"
                      className="error text-danger"
                    />
                    {(values.discountType === "Discount" ||
                      values.discountType === "Deal") && (
                      <div className="mt-3">
                        <label className="form-label">
                          {values.discountType === "Discount"
                            ? "Percentage"
                            : "Amount"}
                        </label>
                        <Field
                          name="discountValue"
                          type="number"
                          className="form-input"
                          placeholder={
                            values.discountType === "Discount" ? "%" : "$"
                          }
                        />
                      </div>
                    )}
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Image</label>
                    <div className="file-upload-container">
                      <label htmlFor="fileUpload" className="upload-label">
                        Upload Files
                        <input
                          type="file"
                          id="fileUpload"
                          ref={fileInputRef}
                          accept=".jpeg, .png, .gif, .svg"
                          onChange={handleFileChange}
                          multiple
                          style={{ display: "none" }}
                        />
                      </label>
                      <div className="file-info">
                        {images && images.length > 0 ? (
                          images.map((file, index) => (
                            <div key={index} className="uploaded-file row py-2">
                              <div className="col">{file.name}</div>
                              <div className="col">
                                <button
                                  type="button"
                                  className="btn btn-sm"
                                  onClick={() => handleRemoveImage(index)}
                                >
                                  <Delete className="text-danger" />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>Choose files or drag and drop here</p>
                        )}
                      </div>
                      {imageError && (
                        <div className="error text-danger">{imageError}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="col-12 col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Offer Validity Period</label>
                    <div className="w-100">
                      <RangePicker
                        value={range}
                        onChange={handleRangeChange}
                        format="YYYY-MM-DD"
                        className="ant-picker"
                        style={{ height: "45px" }}
                        disabledDate={disablePastDates}
                      />
                    </div>
                    <p className="form-note mt-2">
                      Note: Specify the duration for which the coupon is valid,
                      including both the start and end dates.
                    </p>
                  </div>

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
                              startTime: "00:01",
                              endTime: "23:59",
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
                        <Field
                          name="startTime"
                          type="time"
                          className="form-input"
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label">End Time</label>
                        <Field
                          name="endTime"
                          type="time"
                          className="form-input"
                        />
                        <ErrorMessage
                          name="endTime"
                          component="div"
                          className="text-danger mt-1"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="custom-days mt-3">
                      {customDays.map((day, index) => (
                        <div
                          key={index}
                          className="custom-day-row d-flex align-items-center mb-2"
                        >
                          <select
                            className="form-input w-25"
                            value={day.day}
                            onChange={(e) =>
                              handleCustomDayChange(
                                index,
                                "day",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select Day</option>
                            {[
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                              "Saturday",
                              "Sunday",
                            ].map((d) => (
                              <option
                                key={d}
                                value={d}
                                disabled={
                                  customDays.some(
                                    (cd, i) => cd.day === d && i !== index
                                  ) || disabledDays.includes(d)
                                }
                              >
                                {d}
                              </option>
                            ))}
                          </select>

                          <div className="mx-2 w-25 d-flex align-items-center">
                            <input
                              type="time"
                              className="form-input"
                              value={day.startTime}
                              onChange={(e) =>
                                handleCustomDayChange(
                                  index,
                                  "startTime",
                                  e.target.value
                                )
                              }
                            />
                            {/* <span className="ms-2">{convertTo12Hour(day.startTime)}</span> */}
                          </div>

                          <div className="w-25 d-flex align-items-center">
                            <input
                              type="time"
                              className="form-input"
                              value={day.endTime}
                              onChange={(e) =>
                                handleCustomDayChange(
                                  index,
                                  "endTime",
                                  e.target.value
                                )
                              }
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
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="mt-4 text-end">
                <button className="theme-btn btn-border me-2" type="button">
                  Clear
                </button>
                <button
                  className="theme-btn btn-main"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddOffer;
