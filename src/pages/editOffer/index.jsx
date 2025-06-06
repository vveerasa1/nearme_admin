import { useEffect, useRef, useState } from "react";
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
import { Toaster, toast } from "react-hot-toast";
import axiosInstance from "../../interceptors/axiosInstance";
import CircularProgress from "@mui/material/CircularProgress";
import {
  convert12hTo24h,
  convert24hTo12h,
  formatWeeklyHours,
} from "./constant";
dayjs.extend(weekday);
dayjs.extend(isBetween);
const { RangePicker } = DatePicker;

const EditOffer = () => {
  const navigate = useNavigate();
  const { type, _id } = useParams();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [photoError, setPhotoError] = useState("");

  const [customDays, setCustomDays] = useState([
    { day: "", startTime: "", endTime: "" },
  ]);
  const fileInputRef = useRef(null);
  const [existingImages, setExistingImages] = useState([]);
  const [images, setPhotos] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/jpg"];
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const MAX_IMAGES = 5;
  const [range, setRange] = useState([dayjs(), dayjs()]);
  const [disabledDays, setDisabledDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    couponDescription: "",
    discountType: "",
    discountValue: "",
    type: false,
    startDate: new Date(),
    endDate: new Date(),
    startTime: "00:01",
    endTime: "23:59",
  });
  let allWeekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${baseUrl}coupons/${_id}`);
        const data = res.data.data;

        if (data.images && data.images.length > 0) {
          setExistingImages(data.images);
        }
        setInitialValues({
          title: data.title || "",
          description: data.description || "",
          couponDescription: data.couponDescription || "",
          discountType: data.discountType || "",
          discountValue: data.discountValue || "",
          images: data.images || "",
          type: data.type || false,
          startDate: data.dateRange.startDate,

          endDate: data.dateRange.endDate
            ? dayjs(data.dateRange.endDate)
            : dayjs(),
          startTime:
            !data.type && data.activeTime?.startTime
              ? data.activeTime.startTime
              : "00:01",
          endTime:
            !data.type && data.activeTime?.endTime
              ? data.activeTime.endTime
              : "23:59",
        });

        setRange([
          data.dateRange.startDate ? dayjs(data.dateRange.startDate) : dayjs(),
          data.dateRange.endDate ? dayjs(data.dateRange.endDate) : dayjs(),
        ]);

        if (
          data.type &&
          Array.isArray(data.customDays) &&
          data.customDays.length > 0
        ) {
          const formattedCustomDays = data.customDays.map((day) => ({
            day: day.day,
            startTime: day.startTime,
            endTime: day.endTime,
          }));

          setCustomDays(formattedCustomDays);
        } else {
          setCustomDays([{ day: "", startTime: "00:01", endTime: "23:59" }]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [_id, baseUrl]);

  // const resizeImage = (file, width, height) => {
  //   return new Promise((resolve, reject) => {
  //     const img = new window.Image();
  //     const reader = new window.FileReader();
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
    const files = Array.from(e.target.files);
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
          // await checkImageDimensions(file); // validate original dimensions
          const resizedImage = await resizeImage(file, 800, 600); // resize to 800x600
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

  const handleRemoveNewImage = (indexToRemove) => {
    setNewImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const convertTo24HourFormat = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

  const handleCustomDayChange = (index, field, value) => {
    const updatedDays = [...customDays];

    // Convert time fields to 24-hour format
    if (field === "startTime" || field === "endTime") {
      value = convertTo24HourFormat(value);
    }

    updatedDays[index][field] = value; // Update the specific field (day, startTime, or endTime)
    console.log(`Updating ${field} for index ${index}:`, value); // Debugging log
    console.log("Updated Days:", updatedDays); // Debugging log
    const start = dayjs(updatedDays[index].startTime, "HH:mm"); // 24-hour format
    const end = dayjs(updatedDays[index].endTime, "HH:mm");

    if (start.isValid() && end.isValid() && end.isBefore(start)) {
      toast.error("End time should be greater than start time.");
      updatedDays[index].endTime = "23:59"; // reset to default valid time
    }
    setCustomDays(updatedDays); // Update the state
  };
  const handleAddDay = () => {
    const lastDay = customDays[customDays.length - 1];
    if (!lastDay.day) {
      toast.error("Please select a day before adding another.");
      return;
    }
    setCustomDays([
      ...customDays,
      { day: "", startTime: "00:01", endTime: "23:59" },
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
      if (start.isAfter(end)) {
        setRange([end, start]);
      } else {
        setRange([start, end]);
      }
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
        const disabled = allWeekdays.filter(
          (day) => !daysInRange.includes(day)
        );
        setDisabledDays(disabled);
      } else setDisabledDays([]);
    } else {
      setRange([null, null]);
      setDisabledDays([]);
    }
  };

  const disablePastDates = (current) => {
    return current && current < dayjs().startOf("day");
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

  const handleSubmit = async (values, { resetForm }) => {
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
    // console.log(values.type);

    // Reject if any day is not selected
    const hasInvalidDay = customDays.some(
      (day) => !day.day || day.day.trim() === ""
    );
    // console.log(hasInvalidDay);
    if (hasInvalidDay === true && values.type === true) {
      toast.error("Please select a valid day for all custom schedule entries");
      return;
    }

    // return;
    // return;
    setLoading(true);
    const formData = new window.FormData();
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
    if (values.discountType === "Discount") {
      formData.append("discountValue", values.discountValue);
    }
    formData.append("existingImages", JSON.stringify(existingImages));
    if (images?.length > 0) {
      images.forEach((file) => formData.append("newImages", file));
    }
    try {
      const updateResponse = await axiosInstance.put(
        `${baseUrl}coupons/${_id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (updateResponse.status === 200) {
        toast.success(`${values.discountType} updated successfully!`);
        // resetForm();
        setTimeout(() => {
          if (values.discountType == "Discount") {
            navigate("/discounts");
          } else if (values.discountType == "Deal") {
            navigate("/deals");
          } else {
            navigate("/coupons");
          }
          // replace with your actual route
        }, 1500); // gives the user a moment to see the toast
      }

      setLoading(false);
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("Failed to update coupon.");
      setLoading(false);
    }
  };

  const handleImageDelete = async (urlOrIdx) => {
    // If deleting a new image (by index), else existing image (by url)
    if (typeof urlOrIdx === "number") {
      handleRemoveNewImage(urlOrIdx);
      return;
    }
    try {
      const deleteUrl = `${baseUrl}coupons/${_id}/image`;
      await axiosInstance.delete(deleteUrl, { data: { imageUrl: urlOrIdx } });
      setExistingImages((prevImages) =>
        prevImages.filter((image) => image !== urlOrIdx)
      );
    } catch (err) {
      console.error("Error deleting image:", err.response?.data || err.message);
    }
  };

  return (
    <>
      <Toaster position="bottom-center" />
      <div className="content-wrapper">
        {/* Breadcrumb */}
        <div className="breadcrumb-wrapper">
          <div className="breadcrumb-block">
            <h2 className="page-heading">Edit {type}</h2>
            <ul className="breadcrumb-list">
              <li className="breadcrumb-item">
                <Link to={"/dashboard"} className="breadcrumb-link">
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item">
                <span className="breadcrumb-link">{type}</span>
              </li>
            </ul>
          </div>
        </div>
        {/* Add form */}
        <div className="form-container">
          <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={Yup.object({
              title: Yup.string().required("Title is required"),
              description: Yup.string().required("Description is required"),
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
            })}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange }) => (
              <Form className="form-wrapper">
                <div className="row ">
                  <div className="col-12 col-md-12 col-lg-6">
                    <div className="row">
                      {/* Title */}
                      <div className="col-12 mb-3">
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
                            className="error"
                          />
                        </div>
                      </div>
                      {/* Description */}
                      <div className="col-12 mb-3">
                        <div className="form-group">
                          <label className="form-label">How to use</label>
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
                            className="error"
                          />
                        </div>
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
                      {/* Offer Type */}
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
                      {/* Image Upload */}
                      <div className="col-12 mb-3">
                        <div className="form-group">
                          <label className="form-label">Image</label>
                          <div className="file-upload-container">
                            <label
                              htmlFor="fileUpload"
                              className="upload-label"
                            >
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
                              {existingImages.length > 0 &&
                                existingImages.map((url, index) => (
                                  <div
                                    key={`existing-${index}`}
                                    className="uploaded-file row py-2"
                                  >
                                    <div className="col-5 mb-2">
                                      <img
                                        src={url}
                                        alt="uploaded"
                                        height="60"
                                      />
                                    </div>
                                    <div className="col mt-2">
                                      <button
                                        type="button"
                                        className="remove-btn btn btn-sm"
                                        onClick={() => handleImageDelete(url)}
                                      >
                                        <Delete className="text-danger" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              {images?.length > 0 &&
                                images?.map((file, index) => (
                                  <div
                                    key={`new-${index}`}
                                    className="uploaded-file row py-2"
                                  >
                                    <div className="col">
                                      <span>{file.name}</span>
                                    </div>
                                    <div className="col">
                                      <button
                                        type="button"
                                        className="remove-btn btn btn-sm"
                                        onClick={() => handleImageDelete(index)}
                                      >
                                        <Delete className="text-danger" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              {existingImages.length === 0 &&
                                newImages.length === 0 && (
                                  <p>Choose files or drag and drop here</p>
                                )}
                              {imageError && (
                                <div className="error">{imageError}</div>
                              )}
                            </div>
                          </div>
                        </div>
                        <p
                          className="note text-muted"
                          style={{ fontSize: "0.875rem" }}
                        >
                          Note: Upload images in JPEG, PNG, GIF, or SVG format,
                          max 5MB, and between 800x600 pixels.
                        </p>
                      </div>
                      {/* Offer Validity */}

                      {/* Custom Days Toggle */}

                      {/* Submit Button - aligned right */}
                      {/* <div className="col-12">
                      <div className="d-flex justify-content-end">
                        <button
                          type="submit"
                          className="btn btn-primary d-flex align-items-center"
                          disabled={loading}
                        >
                          {loading && <CircularProgress size={16} color="inherit" className="me-2" />}
                          {loading ? "Submitting..." : "Update Offer"}
                        </button>
                      </div>
                    </div> */}
                      {/* <div className="col-12 col-md-12 col-lg-12"> */}

                      {/* </div> */}
                    </div>
                  </div>

                  <div
                    className="col-12 col-md-12 col-lg-6 d-flex flex-column justify-content-between"
                    style={{ minHeight: "100%" }}
                  >
                    <div className="flex-grow-1">
                      {/* Offer Validity Period */}
                      <div className="form-group mb-4">
                        <label className="form-label">
                          Offer Validity Period
                        </label>
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
                          Note: Specify the duration for which the coupon is
                          valid, including both the start and end dates.
                        </p>
                      </div>
                      <div className="col-12 mb-4">
                        <div className="form-group d-flex align-items-center">
                          <Field
                            type="checkbox"
                            name="type"
                            checked={values.type}
                            onChange={handleChange}
                            className="me-2"
                          />
                          <span>Custom Days</span>
                        </div>
                      </div>
                      {/* Custom Days OR Start/End Time */}
                      <div className="col-12 mb-3">
                        {/* <label className="form-label">Custom time</label> */}

                        {values.type ? (
                          <div className="custom-days mt-3">
                            {customDays.map((day, index) => (
                              <div
                                key={index}
                                className="custom-day-row d-flex align-items-center mb-2"
                              >
                                {/* Day Dropdown */}
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

                                {/* Start Time Input */}
                                <div className="mx-2 w-25 d-flex align-items-center">
                                  <input
                                    type="time"
                                    className="form-input"
                                    value={day.startTime} // Bind to the state
                                    onChange={(e) =>
                                      handleCustomDayChange(
                                        index,
                                        "startTime",
                                        e.target.value
                                      )
                                    } // Update state on change
                                  />
                                </div>

                                {/* End Time Input */}
                                <div className="w-25 d-flex align-items-center">
                                  <input
                                    type="time"
                                    className="form-input"
                                    value={day.endTime} // Bind to the state
                                    onChange={(e) =>
                                      handleCustomDayChange(
                                        index,
                                        "endTime",
                                        e.target.value
                                      )
                                    } // Update state on change
                                  />
                                </div>

                                {/* Add or Remove Button */}
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
                        ) : (
                          <div className="row">
                            <div className="col-6 mb-3">
                              <div className="form-group">
                                <label className="form-label">
                                  Offer Active Start Time
                                </label>
                                <Field
                                  name="startTime"
                                  type="time"
                                  className="form-input"
                                />
                              </div>
                            </div>
                            <div className="col-6 mb-3">
                              <div className="form-group">
                                <label className="form-label">
                                  Offer Active End Time
                                </label>
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
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Buttons aligned to bottom */}
                    <div className="mt-3 text-end">
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
                          "Update offer"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default EditOffer;
