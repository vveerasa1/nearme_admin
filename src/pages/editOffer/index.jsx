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
import CircularProgress from "@mui/material/CircularProgress";
import { convert12hTo24h, convert24hTo12h, formatWeeklyHours } from "./constant";
dayjs.extend(weekday);
dayjs.extend(isBetween);
const { RangePicker } = DatePicker;

const EditOffer = () => {
  const navigate = useNavigate();
  const { type, _id } = useParams();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const [customDays, setCustomDays] = useState([
    { day: "", startTime: "", endTime: "" },
  ]);
  const fileInputRef = useRef(null);
  const [existingImages, setExistingImages] = useState([]);
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
    couponDescription:"",
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
      const res = await axios.get(`${baseUrl}coupons/${_id}`);
      const data = res.data.data;

      if (data.images && data.images.length > 0) {
        setExistingImages(data.images);
      }
console.log('-- -- -- ',data.startTime);
      setInitialValues({
        title: data.title || "",
        description: data.description || "",
        couponDescription: data.couponDescription || "",
        discountType: data.discountType || "",
        discountValue: data.discountValue || "",
        images: data.images || "",
        type: data.type || false,
        startDate: data.startDate ? dayjs(data.startDate) : dayjs(),
        endDate: data.endDate ? dayjs(data.endDate) : dayjs(),
        startTime: data.activeTime.startTime || "00:00",
        endTime: data.activeTime.endTime || "23:59",
      });

      if (data.type && data.customDays && data.customDays.length > 0) {
        // Map the customDays to ensure proper formatting
        const formattedCustomDays = data.customDays.map((day) => ({
          day: day.day || "",
          startTime: convert12hTo24h(day.startTime || "12:00 AM"), // Convert to 24-hour format
          endTime: convert12hTo24h(day.endTime || "11:59 PM"), 
        }));

        setCustomDays(formattedCustomDays);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, [_id, baseUrl]);

  const resizeImage = (file, width, height) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const reader = new window.FileReader();
      reader.onload = (e) => { img.src = e.target.result; };
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => resolve(new File([blob], file.name, { type: file.type })),
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
    if (files.length + newImages.length > MAX_IMAGES) {
      error = `You can upload a maximum of ${MAX_IMAGES} images.`;
    }
    const resizedImages = [];
    for (const file of files) {
      if (!SUPPORTED_FORMATS.includes(file.type)) {
        error = "Only JPEG, JPG, and PNG formats are allowed.";
      } else if (file.size > MAX_FILE_SIZE) {
        error = "Each file must not exceed 5 MB.";
      } else {
        try {
          const resizedImage = await resizeImage(file, 400, 400);
          resizedImages.push(resizedImage);
        } catch (err) {
          console.error("Error resizing image:", err);
        }
      }
    }
    if (error) setImageError(error);
    else {
      setImageError("");
      setNewImages((prevImages) => [...prevImages, ...resizedImages]);
    }
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
        const allWeekdays = [
          "Monday", "Tuesday", "Wednesday", "Thursday",
          "Friday", "Saturday", "Sunday"
        ];
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
    ? customDays.map((d) => ({
        ...d,
        startTime: convert24hTo12h(d.startTime),
        endTime: convert24hTo12h(d.endTime),
      }))
    : [];
    setLoading(true);
    const formData = new window.FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("couponDescription", values.couponDescription);

    
    formData.append("discountType", values.discountType);
    formData.append("type", values.type);
    formData.append("startDate", formatDate(range[0]) );
    formData.append("endDate", formatDate(range[1]));
    if (values.type) {
      formData.append("customDays", JSON.stringify(daysToSubmit));
    } else {
      formData.append(
        "startTime",
        convertTo24Hour(values.startTime)
      );
      formData.append(
        "endTime",
        convertTo24Hour(values.endTime)
      );
    }
    if (values.discountType === "Discount") {
      formData.append("discountValue", values.discountValue);
    }
    formData.append("existingImages", JSON.stringify(existingImages));
    if (newImages.length > 0) {
      newImages.forEach((file) => formData.append("newImages", file));
    }
    try {
      const updateResponse = await axios.put(
        `${baseUrl}coupons/${_id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    
      if (updateResponse.status === 200) {
        toast.success(`${values.discountType} updated successfully!`);
        // resetForm();
        setTimeout(() => {
          if(values.discountType == 'Discount'){
            navigate("/discounts");

          } else if(values.discountType == 'Deal'){
            navigate("/deals");
          } else{
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
      await axios.delete(deleteUrl, { data: { imageUrl: urlOrIdx } });
      setExistingImages((prevImages) =>
        prevImages.filter((image) => image !== urlOrIdx)
      );
    } catch (err) {
      console.error("Error deleting image:", err.response?.data || err.message);
    }
  };

  return (
    <div className="content-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb-wrapper">
        <div className="breadcrumb-block">
          <h2 className="page-heading">Edit {type}</h2>
          <ul className="breadcrumb-list">
            <li className="breadcrumb-item">
              <Link to={"/dashboard"} className="breadcrumb-link">Home</Link>
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
                    <label className="form-label">Coupon Description</label>
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
                    <div className="col-12 mb-3">
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
                      {/* Discount Value */}
                      {values.discountType === "Discount" && (
                        <div className="mt-4">
                          <label className="form-label">Percentage</label>
                          <Field
                            name="discountValue"
                            type="text"
                            className="form-input"
                            placeholder="%"
                          />
                        </div>
                      )}
                    </div>
                    {/* Image Upload */}
                    <div className="col-12 mb-3">
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
                            {existingImages.length > 0 &&
                              existingImages.map((url, index) => (
                                <div key={`existing-${index}`} className="uploaded-file row py-2">
                                  <div className="col-5 mb-2">
                                    <img src={url} alt="uploaded" height="60" />
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
                            {newImages.length > 0 &&
                              newImages.map((file, index) => (
                                <div key={`new-${index}`} className="uploaded-file row py-2">
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
                            {existingImages.length === 0 && newImages.length === 0 && (
                              <p>Choose files or drag and drop here</p>
                            )}
                            {imageError && <div className="error">{imageError}</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Offer Validity */}
                    <div className="form-group mb-3">
                    <label className="form-label">Offer Validity Period</label>
                    <div className="w-100">
                      <RangePicker
                        value={range}
                        onChange={handleRangeChange}
                        format="YYYY-MM-DD"
                        className="ant-picker"
                        style={{ height: "45px" }}
                      />
                    </div>
                    <p className="form-note mt-2">
                      Note: Specify the duration for which the coupon is valid,
                      including both the start and end dates.
                    </p>
                  </div>
                    {/* Custom Days Toggle */}
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
                    <label className="form-label">Custom time</label>

                    {values.type ? (
 <div className="custom-days mt-3">
 {customDays.map((day, index) => (
   <div key={index} className="custom-day-row d-flex align-items-center mb-2">
     {/* Day Dropdown */}
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
               customDays.some((cd, i) => cd.day === d && i !== index) ||
               disabledDays.includes(d)
             }
           >
             {d}
           </option>
         )
       )}
     </select>

     {/* Start Time Input */}
     <div className="mx-2 w-25 d-flex align-items-center">
       <input
         type="time"
         className="form-input"
         value={day.startTime} // Bind to the state
         onChange={(e) => handleCustomDayChange(index, "startTime", e.target.value)} // Update state on change
       />
     </div>

     {/* End Time Input */}
     <div className="w-25 d-flex align-items-center">
       <input
         type="time"
         className="form-input"
         value={day.endTime} // Bind to the state
         onChange={(e) => handleCustomDayChange(index, "endTime", e.target.value)} // Update state on change
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
        <label className="form-label">Offer Active Start Time</label>
        <Field
          name="startTime"
          type="time"
          className="form-input"
        />
      </div>
    </div>
    <div className="col-6 mb-3">
      <div className="form-group">
        <label className="form-label">Offer Active End Time</label>
        <Field
          name="endTime"
          type="time"
          className="form-input"
        />
      </div>
    </div>
  </div>
)}
                    </div>
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
                    "Update offer"
                  )}
                </button>
              </div>
                  {/* </div> */}
                  </div>
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