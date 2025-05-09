import { useRef, useState } from "react";
import "./style.css";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
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
import { Toaster, toast } from "react-hot-toast";

dayjs.extend(weekday);
dayjs.extend(isBetween);

const { RangePicker } = DatePicker;

const AddOffer = () => {
  const [customDays, setCustomDays] = useState([
    { day: "", startTime: "", endTime: "" },
  ]);

  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState(""); // State for image validation errors
  const [range, setRange] = useState([dayjs(), dayjs()]);
  const [disabledDays, setDisabledDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/jpg"];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const MAX_IMAGES = 5;

  const { _id } = useParams();

  const resizeImage = (file, width, height) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
  
      reader.onload = (e) => {
        img.src = e.target.result;
      };
  
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        canvas.width = width;
        canvas.height = height;
  
        // Draw the image on the canvas with the specified dimensions
        ctx.drawImage(img, 0, 0, width, height);
  
        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, { type: file.type }));
          },
          file.type,
          1
        );
      };
  
      img.onerror = (err) => reject(err);
  
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    let error = "";
  
    // Validate file count
    if (files.length + images.length > MAX_IMAGES) {
      error = `You can upload a maximum of ${MAX_IMAGES} images.`;
    }
  
    const resizedImages = [];
    for (const file of files) {
      // Validate file type and size
      if (!SUPPORTED_FORMATS.includes(file.type)) {
        error = "Only JPEG, JPG, and PNG formats are allowed.";
      } else if (file.size > MAX_FILE_SIZE) {
        error = "Each file must not exceed 5 MB.";
      } else {
        try {
          // Resize the image to a standard size (e.g., 500x500 pixels)
          const resizedImage = await resizeImage(file, 400, 400);
          resizedImages.push(resizedImage);
        } catch (err) {
          console.error("Error resizing image:", err);
        }
      }
    }
  
    if (error) {
      setImageError(error);
    } else {
      setImageError(""); // Clear error if validation passes
      setImages((prevImages) => [...prevImages, ...resizedImages]);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };
  const handleCustomDayChange = (index, field, value) => {
    const updatedDays = [...customDays];
    updatedDays[index][field] = value;
    setCustomDays(updatedDays);
  };

  const handleAddDay = () => {
    const lastDay = customDays[customDays.length - 1];
  
    // Validate that the last day has a selected day
    if (!lastDay.day) {
      toast.error("Please select a day before adding another.");
      return;
    }
  
    // Add a new custom day with default startTime and endTime
    setCustomDays([
      ...customDays,
      { day: "", startTime: "00:00", endTime: "23:59" },
    ]);
  };

  const handleRemoveDay = (index) => {
    const updatedDays = [...customDays];
    updatedDays.splice(index, 1);
    setCustomDays(updatedDays);
  };

  const handleRangeChange = (dates) => {
    if (dates) {
      const start = dayjs(dates[0]);
      const end = dayjs(dates[1]);

      // Ensure the start date is always before or the same as the end date
      if (start.isAfter(end)) {
        // If start date is after end date, reset the range to ensure correct order
        setRange([end, start]);
      } else {
        setRange([start, end]);
      }

      // Check if both dates are in the same month
      const isSameMonth =
        start.month() === end.month() && start.year() === end.year();

      if (isSameMonth) {
        const daysInRange = [];

        for (
          let d = start;
          d.isBefore(end) || d.isSame(end);
          d = d.add(1, "day")
        ) {
          const weekday = d.format("dddd");
          if (!daysInRange.includes(weekday)) {
            daysInRange.push(weekday);
          }
        }

        // Only disable days NOT in selected range
        const allWeekdays = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];
        const disabled = allWeekdays.filter(
          (day) => !daysInRange.includes(day)
        );
        setDisabledDays(disabled);
      } else {
        // If range spans months, enable all days
        setDisabledDays([]);
      }
    } else {
      setRange([null, null]);
      setDisabledDays([]);
    }
  };

  const handleSubmit = async (values, formikHelpers = {}) => {
    const { resetForm } = formikHelpers;
    setLoading(true);

    const formData = new FormData();
    formData.append("place_Id", _id);
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("couponDescription", values.couponDescription);
    formData.append("discountType", values.discountType);
    formData.append("type", values.type);
    formData.append("startDate", range[0]);
    formData.append("endDate", range[1]);

    if (values.type) {
      formData.append("customDays", JSON.stringify(customDays));
    } else {
      formData.append("startTime", values.startTime);
      formData.append("endTime", values.endTime);
    }

    if (values.discountType === "Discount") {
      formData.append("discountValue", values.discountValue);
    }

    if (images) {
      console.log(images);
      Array.from(images).forEach((file) => {
        formData.append("images", file);
      });
    }

    try {
      const response = await axios.post(
        "http://localhost:4001/coupons/",
        formData
      );
      console.log("Submitted:", response.data);

      if (resetForm) resetForm(); // only call if it's defined
      setImages(null);
      toast.success("Coupon Created Successfully");

      if (fileInputRef.current) {
        fileInputRef.current.value = null; // Reset file input
      }

      setCustomDays([{ day: "", startTime: "", endTime: "" }]); // reset customDays state
      setRange([dayjs(), dayjs()]); // Reset date range
      setDisabledDays([]);
    } catch (err) {
      console.error("ERROR", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-wrapper">
      <Toaster />
      {/* breadcrumb */}
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
              <a className="breadcrumb-link">Offer</a>
            </li>
          </ul>
        </div>
      </div>
      {/* add form */}
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
            startTime: "00:00",
            endTime: "23:59",
          }}
          validationSchema={Yup.object({
            // title: Yup.string().required("Title is required"),
            // description: Yup.string().required("Description is required"),
            // couponDescription: Yup.string().required("Description is required"),
          })}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange }) => (
            <Form className="form-wrapper">
              <div className="row">
                <div className="col-12 col-md-12 col-lg-6">
                  <div className="row">
                    {/* title */}
                    <div className="col-12 col-md-12 col-lg-12 mb-3">
                      <div className="form-group">
                        <label className="form-label">Title</label>
                        <Field
                          name="title"
                          type="text"
                          className="form-input"
                          placeholder="Enter title here"
                        />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="error text-danger"
                        />
                      </div>
                    </div>
                    {/* description */}
                    <div className="col-12 col-md-12 col-lg-12 mb-3">
                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <Field
                          as="textarea"
                          name="description"
                          className="form-input"
                          cols={30}
                          rows={3}
                          placeholder="Type something here"
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="error text-danger"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-12 mb-3">
                      <div className="form-group">
                        <label className="form-label">Coupon Description</label>
                        <Field
                          as="textarea"
                          name="couponDescription"
                          className="form-input"
                          cols={30}
                          rows={3}
                          placeholder="Type something here"
                        />
                        <ErrorMessage
                          name="couponDescription"
                          component="div"
                          className="error text-danger"
                        />
                      </div>
                    </div>
                    {/* discount type */}
                    <div className="col-12 col-md-12 col-lg-12 mb-3">
                      <div className="form-group">
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
                      </div>
                      {/* discount */}
                      {values.discountType === "Discount" ? (
                        <div className="mt-4">
                          <label className="form-label">Percentage</label>
                          <Field
                            name="discountValue"
                            type="text"
                            className="form-input"
                            placeholder="%"
                          />
                        </div>
                      ) : values.discountType === "Deal" ? (
                        <div className="mt-4">
                          <label className="form-label">Amount</label>
                          <Field
                            name="discountValue"
                            type="text"
                            className="form-input"
                            placeholder="$"
                          />
                        </div>
                      ) : null}
                    </div>
                    {/* image */}
                    <div className="col-12 col-md-12 col-lg-12 mb-3">
                      <div className="form-group">
                        <label className="form-label">Image</label>
                        <div className="file-upload-container">
                          <label htmlFor="fileUpload" className="upload-label">
                            Upload Files
                            <input
                              type="file"
                              id="fileUpload"
                              ref={fileInputRef}
                              accept=".jpeg, .png, .jpg"
                              onChange={handleFileChange}
                              multiple
                              style={{ display: "none" }}
                            />
                          </label>

                          <div className="file-info">
                            {images && images.length > 0 ? (
                              images.map((file, index) => (
                                <div
                                  key={index}
                                  className="uploaded-file row  py-2"
                                >
                                  <div className=" col">
                                    <span className="">{file.name}</span>
                                  </div>
                                  <div className="col">
                                    <button
                                      type="button"
                                      className="remove-btn btn btn-sm btn-sm "
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
                            <div className="error text-danger">
                              {imageError}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-12 col-lg-6 mb-4">
                  <div className="row">
                    {/* validity */}
                    <div className="col-12 col-md-12 col-lg-12 mb-3">
                      <div className="form-group">
                        <label className="form-label">
                          Offer Validity Period
                        </label>
                        <div>
                          <RangePicker
                            value={range}
                            onChange={handleRangeChange}
                            format="YYYY-MM-DD"
                          />
                        </div>
                        <p className="form-note">
                          Note: Specify the duration for which the coupon is
                          valid, including both the start and end dates.
                        </p>
                      </div>
                    </div>
                    {/* time */}
                    <div
                      hidden={values.type}
                      className="col-12 col-md-6 col-lg-6 mb-3"
                    >
                      <div className="form-group">
                        <label className="form-label">
                          Offer Active Start time
                        </label>
                        <Field
                          name="startTime"
                          type="time"
                          className="form-input"
                        />
                      </div>
                    </div>
                    <div
                      hidden={values.type}
                      className="col-12 col-md-6 col-lg-6 mb-4"
                    >
                      <div className="form-group">
                        <label className="form-label">
                          Offer Active End time
                        </label>
                        <Field
                          name="endTime"
                          type="time"
                          className="form-input"
                        />
                      </div>
                    </div>

                    {/* Custom days checkbox */}
                    <div className="col-12 col-md-12 col-lg-12 mb-4">
                      <div className="form-group ">
                        <label className="form-label d-flex">
                          <Field
                            className=""
                            type="checkbox"
                            name="type"
                            checked={values.type}
                            onChange={handleChange}
                          />
                          <span className="">Custom Days</span>
                        </label>
                      </div>
                    </div>

                    {/* Custom days section */}
                    {values.type && (
                      <div className="custom-days">
                        {customDays.map((day, index) => (
                          <div key={index} className="custom-day-row mb-3">
                            <Field
                              className="w-25 py-1"
                              as="select"
                              placeholder="Day"
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
                              <option
                                value="Monday"
                                disabled={disabledDays.includes("Monday")}
                              >
                                Monday
                              </option>
                              <option
                                value="Tuesday"
                                disabled={disabledDays.includes("Tuesday")}
                              >
                                Tuesday
                              </option>
                              <option
                                value="Wednesday"
                                disabled={disabledDays.includes("Wednesday")}
                              >
                                Wednesday
                              </option>
                              <option
                                value="Thursday"
                                disabled={disabledDays.includes("Thursday")}
                              >
                                Thursday
                              </option>
                              <option
                                value="Friday"
                                disabled={disabledDays.includes("Friday")}
                              >
                                Friday
                              </option>
                              <option
                                value="Saturday"
                                disabled={disabledDays.includes("Saturday")}
                              >
                                Saturday
                              </option>
                              <option
                                value="Sunday"
                                disabled={disabledDays.includes("Sunday")}
                              >
                                Sunday
                              </option>
                            </Field>
                            <Field
                              className="mx-3 py-1"
                              type="time"
                              placeholder="Start Time"
                              value={day.startTime || "00:00"}
                              onChange={(e) =>
                                handleCustomDayChange(
                                  index,
                                  "startTime",
                                  e.target.value
                                )
                              }
                            />
                            <Field
                              className="w-25 py-1"
                              type="time"
                              placeholder="End Time"
                              value={day.endTime || "23:59"}
                              onChange={(e) =>
                                handleCustomDayChange(
                                  index,
                                  "endTime",
                                  e.target.value
                                )
                              }
                            />

                            {/* Add button should only be visible for the first row */}
                            {index === 0 && (
                              <button
                                type="button"
                                onClick={handleAddDay}
                                className="btn btn-sm btn-primary mx-3 p-1 mb-1 px-2"
                              >
                                <Add />
                              </button>
                            )}

                            {/* Remove button should be visible for all rows except the first one */}
                            {customDays.length > 1 && index !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveDay(index)}
                                className="btn btn-sm btn-danger mx-3 p-1 mb-1 px-2"
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
              </div>
              {/* Submit Button */}
              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  {loading === true ? "Submitting..." : "Add Offer"}
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
