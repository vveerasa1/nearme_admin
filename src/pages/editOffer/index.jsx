import { useEffect, useRef, useState } from "react";
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

const EditOffer = () => {
  const { _id } = useParams();
  const [customDays, setCustomDays] = useState([
    { day: "", startTime: "", endTime: "" },
  ]);

  
  const fileInputRef = useRef(null);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imageError, setImageError] = useState(""); // State for image validation errors

  const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/jpg"];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const MAX_IMAGES = 5;
  const [range, setRange] = useState([dayjs(), dayjs()]);
  const [disabledDays, setDisabledDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    discountType: "",
    discountValue: "",
    type: false,
    startDate: new Date(),
    endDate: new Date(),
    startTime: "00:00",
    endTime: "23:59",
  });




  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:4001/coupons/${_id}`);
        const data = res.data.data;
        if (data.images && data.images.length > 0) {
          setExistingImages(data.images); // assuming it's an array of URLs or paths
        }

        console.log("Fetched Data:", data);
        setInitialValues({
          title: data.title || "",
          description: data.description || "",
          discountType: data.discountType || "",
          discountValue: data.discountValue || "",
          images: data.images || "",
          type: data.type || false,
          startDate: data.startDate ? dayjs(data.startDate) : dayjs(),
          endDate: data.endDate ? dayjs(data.endDate) : dayjs(),
          startTime: data.startTime || "00:00",
          endTime: data.endTime || "23:59",
        });

        if (data.type) {
          setCustomDays(
            data.customDays || [{ day: "", startTime: "", endTime: "" }]
          );
        }
        if (data.startDate && data.endDate) {
          setRange([dayjs(data.startDate), dayjs(data.endDate)]);
        }
      } catch (err) {
        console.error("Error fetching offer data:", err);
      }
    };
    fetchData();
  }, [_id]);

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
    if (files.length + newImages.length > MAX_IMAGES) {
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
      setNewImages((prevImages) => [...prevImages, ...resizedImages]);
    }
  };


  // const handleRemoveNewImage = (indexToRemove) => {
  //   setNewImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  // };

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
  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    const formData = new FormData();

    // Add form fields
    formData.append("title", values.title);
    formData.append("description", values.description);
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

    // Add existing images (after removal)
    formData.append("existingImages", JSON.stringify(existingImages));

    // Add new images
    if (newImages.length > 0) {
      newImages.forEach((file) => formData.append("newImages", file));
    }

    try {
      // Update existing offer
      const updateResponse = await axios.put(
        `http://localhost:4001/coupons/${_id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Updated:", updateResponse.data);

      resetForm();
      setLoading(false);
    } catch (err) {
      console.error("Error submitting form:", err);
      setLoading(false);
    }
  };

  const handleImageDelete = async (url) => {
    try {
      const deleteUrl = `http://localhost:4001/coupons/${_id}/image`; // Ensure _id is defined
  
      const deleteResponse = await axios.delete(deleteUrl, {
        data: { imageUrl: url }, // Pass imageUrl in the data object
      });
  
      console.log("Image URL:", url);
      console.log("Delete Response:", deleteResponse);
  
      // Optionally, update the UI to remove the deleted image
      // For example, you can filter out the deleted image from the existingImages array
      setExistingImages((prevImages) =>
        prevImages.filter((image) => image !== url)
      );
    } catch (err) {
      console.error("Error deleting image:", err.response?.data || err.message);
    }
  };

  return (
    <div className="content-wrapper">
      {/* breadcrumb */}
      <div className="breadcrumb-wrapper">
        <div className="breadcrumb-block">
          <h2 className="page-heading">Edit Offer</h2>
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
      <div className="form-container ">
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={Yup.object({
            title: Yup.string().required("Title is required"),
            description: Yup.string().required("Description is required"),
          })}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange }) => (
            <Form className="form-wrapper">
              <div className="row ">
                <div className="row">
                  <div className="col"></div>
                  <div className="col"></div>
                </div>
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
                          className="error"
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
                          className="error"
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
                      ) : (
                        ""
                      )}
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
                              accept=".jpeg, .png, .gif, .svg"
                              onChange={handleFileChange}
                              multiple
                              style={{ display: "none" }}
                            />
                          </label>

                          <div className="file-info">
                            {/* Existing images */}
                            {existingImages.length > 0 &&
                              existingImages.map((url, index) => (
                                <div
                                  key={`existing-${index}`}
                                  className="uploaded-file row py-2"
                                >
                                  <div className="col-5 mb-2">
                                    <img src={url} alt="uploaded" height="60" />
                                  </div>
                                  <div className="col mt-2">
                                    <button
                                      type="button"
                                      className="remove-btn btn btn-sm"
                                      onClick={() =>
                                        handleImageDelete(url)
                                      }
                                    >
                                      <Delete className="text-danger" />
                                    </button>
                                  </div>
                                </div>
                              ))}

                            {/* New images */}
                            {newImages.length > 0 &&
                              newImages.map((file, index) => (
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
                                      onClick={() =>
                                        handleImageDelete(index)
                                      }
                                    >
                                      <Delete className="text-danger" />
                                    </button>
                                  </div>
                                </div>
                              ))}

                            {existingImages.length === 0 &&
                              newImages.length ===  0 && (
                                <p>Choose files or drag and drop here</p>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row ">
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
                      <div className="custom-days  ">
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
                              value={day.startTime}
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
                              value={day.endTime}
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
                                className="btn btn-sm btn-danger  mx-3 p-1 mb-1 px-2"
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
                {/* Submit Button */}
                <div className="col-12">
                  <button type="submit" className="btn btn-primary">
                    {loading === true ? "Submitting..." : "Update Offer"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditOffer;
