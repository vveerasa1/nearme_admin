import { useState, useRef, useEffect } from "react";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { Star, Add, Remove, Delete } from "@mui/icons-material";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Spin } from "antd";

import CreatableSelect from "react-select/creatable";
import "react-time-picker/dist/TimePicker.css";
import { convert24hTo12h, formatWeeklyHours } from "./constants";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const AddBusiness = () => {
  const [photos, setPhotos] = useState(null);
  const [allTypes, setAllTypes] = useState([]);
  const [filteredTypes, setFilteredTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [photoError, setPhotoError] = useState(""); // State for image validation errors
  const navigate = useNavigate();

  const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/jpg"];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const MAX_IMAGES = 5;
  const [workingHours, setWorkingHours] = useState([
    { day: "", startTime: "", endTime: "", is24Hours: false },
  ]);
  const baseUrl = import.meta.env.VITE_BASE_URL;

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
    if (files.length + (photos?.length || 0) > MAX_IMAGES) {
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
      setPhotoError(error);
    } else {
      setPhotoError("");
      setPhotos((prevPhotos) => [...(prevPhotos || []), ...resizedImages]);
    }
  };

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        setLoading(true);
        const url = `${baseUrl}business/types`;
        const response = await axios.get(url);
        const options = response.data.data.map((type) => ({
          label: type,
          value: type,
        }));
        setAllTypes(options);
        console.log(options);
        setFilteredTypes(options.slice(1, 10));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching types", err);
      }
    };
    fetchTypes();
  }, []);

  const handleRemoveImage = (indexToRemove) => {
    setPhotos((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  // Add a new day row

  // Remove a day row

  const handleSubmit = async (values, { resetForm }) => {
    // console.log("hey", values.business_status);
    // return;
    // Convert working hours to 12-hour format
    const updatedTime = values.working_hours.map((date) => ({
      day: date.day,
      startTime: convert24hTo12h(date.startTime),
      endTime: convert24hTo12h(date.endTime),
      is24Hours: date.is24Hours,
    }));
    // console.log("hellow ", values.types);

    // Set loading state to true
    setLoading(true);

    // Format working hours for submission

    // return;
    // Prepare FormData to send
    const formData = new FormData();
    formData.append("display_name", values.display_name);
    formData.append("types", values.types); // Send types as a list
    formData.append("address", values.address);
    formData.append("street", values.street);
    formData.append("city", values.city);
    formData.append("state", values.state);
    formData.append("postal_code", values.postal_code);
    formData.append("county", values.county);
    formData.append("country_code", values.iso_code);
    formData.append("phone", values.code + values.phone_number);
    formData.append("place_link", values.place_link || "");
    formData.append("rating", values.rating || "");
    formData.append("business_status", values.business_status || "");
    formData.append("reviews", values.reviews || "");
    formData.append(
      "working_hours",
      JSON.stringify(formatWeeklyHours(updatedTime))
    );

    console.log(formData);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // Append photos if available
    if (photos) {
      console.log(photos);
      Array.from(photos).map((file) => formData.append("photo", file));
    }
    // return;
    try {
      // Make the API request
      const response = await axios.post(`${baseUrl}business`, formData);
      console.log("Business submitted:", response.data);

      // Reset form and clear photos/working hours after submission
      setPhotos(null);
      setWorkingHours([{ day: "", startTime: "", endTime: "" }]);
      if (fileInputRef.current) fileInputRef.current.value = null;
      resetForm();
      navigate("/business-listings");
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      // Stop the spinner (set loading to false)
      setLoading(false);
    }
  };

  return (
    <div className="content-wrapper">
      {/* breadcrumb */}
      <div className="breadcrumb-wrapper">
        <div className="breadcrumb-block">
          <h2 className="page-heading">Add Business</h2>
          <ul className="breadcrumb-list">
            <li className="breadcrumb-item">
              <Link to={"/dashboard"} className="breadcrumb-link">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <a className="breadcrumb-link">Business</a>
            </li>
          </ul>
        </div>
      </div>
      {/* add form */}
      <div className="form-container">
        <Formik
          initialValues={{
            display_name: "",
            types: [],
            address: "",
            street: "",
            city: "",
            state: "",
            postal_code: "",
            county: "",
            iso_code: "",
            code: "",
            // NOTE removed by akash as lat long will be add from backend
            // latitude: "",
            // longitude: "",
            phone: "",
            // code: "",
            place_link: "",
            reviews: "",
            rating: "",
            business_status: "",
            // working_hours:"",
            working_hours: [
              {
                day: "",
                startTime: "00:01",
                endTime: "23:59",
                is24Hours: false,
              },
            ],
          }}
          validationSchema={Yup.object({
            display_name: Yup.string().required("Name is required"),
            types: Yup.array()
              .min(1, "At least one type is required")
              .of(Yup.string().required("Each type must be a valid string"))
              .required("Types field is required"),
            address: Yup.string().required("Address is required"),

            street: Yup.string().required("Street is required"),
            city: Yup.string().required("City is required"),
            state: Yup.string().required("State is required"),
            postal_code: Yup.string().required("Postal code is required"),
            county: Yup.string().required("County is required"),
            iso_code: Yup.string()
              .required("Country ISO code is required")
              .matches(
                /^[A-Z]{2,3}$/,
                "Must be a valid ISO code like IN, US, or CA"
              ),
            business_status: Yup.string().required(
              "Business status is required"
            ),
            place_link: Yup.string().url("Invalid URL format"),
            reviews: Yup.number()
              .min(0, "Reviews count cannot be negative")
              .optional(),
            rating: Yup.number()
              .min(1, "Rating must be between 1 and 5")
              .max(5, "Rating must be between 1 and 5")
              .optional(),
            // latitude: Yup.number()
            //   .typeError("Latitude must be a number")
            //   .required("Latitude is required")
            //   .min(-90, "Latitude must be between -90 and 90")
            //   .max(90, "Latitude must be between -90 and 90"),
            // longitude: Yup.number()
            //   .typeError("Longitude must be a number")
            //   .required("Longitude is required")
            //   .min(-180, "Longitude must be between -180 and 180")
            //   .max(180, "Longitude must be between -180 and 180"),
            phone_number: Yup.string()
              .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
              .max(10, "Phone number must be between 10 digits")
              .required("Phone number is required"),
            working_hours: Yup.array()
              .of(
                Yup.object().shape({
                  day: Yup.string()
                    .required("Day is required")
                    .oneOf(daysOfWeek, "Invalid day"),
                  startTime: Yup.string().when("is24Hours", {
                    is: false,
                    then: (schema) => schema.notRequired(),
                    otherwise: (schema) => schema.notRequired(),
                  }),
                  endTime: Yup.string().when("is24Hours", {
                    is: false,
                    then: (schema) => schema.notRequired(),
                    otherwise: (schema) => schema.notRequired(),
                  }),
                  is24Hours: Yup.boolean(),
                })
              )
              .min(1, "At least one working hour is required"),
            // working_hours: Yup.array().of(
            //   Yup.object().shape({
            //     day: Yup.string().required("Day is required"),
            //     startTime: Yup.string().when("is24Hours", {
            //       is: false,
            //       then: Yup.string().required("Start time is required"),
            //       otherwise: Yup.string().nullable(),
            //     }),
            //     endTime: Yup.string().when("is24Hours", {
            //       is: false,
            //       then: Yup.string().required("End time is required"),
            //       otherwise: Yup.string().nullable(),
            //     }),
            //     is24Hours: Yup.boolean().required("is24Hours is required"),
            //   })
            // ),
          })}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors }) => (
            <Form className="form-wrapper">
              <div className="row">
                <div className="col-12 col-md-12 col-lg-6">
                  <div className="row">
                    {/* name */}
                    <div className="col-12 col-md-12 col-lg-12 mb-3">
                      <div className="form-group">
                        <label className="form-label">Name</label>
                        <Field
                          name="display_name"
                          type="text"
                          className="form-input"
                          placeholder="Enter name here"
                        />
                        <ErrorMessage
                          name="display_name"
                          component="div"
                          className="error text-danger"
                        />
                      </div>
                    </div>
                    {/* types */}
                    <div className="col-12 col-md-12 col-lg-12 mb-3">
                      <div className="form-group">
                        <label className="form-label">Types</label>
                        {loading ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              minHeight: "50px",
                            }}
                          >
                            <Spin tip="Loading..." size="small" />
                          </div>
                        ) : (
                          <>
                            <CreatableSelect
                              name="types"
                              options={filteredTypes}
                              value={
                                values.types.length > 0 &&
                                values.types.map(
                                  (type) =>
                                    allTypes.find(
                                      (option) => option.value === type
                                    ) || {
                                      label: type,
                                      value: type,
                                    }
                                )
                              }
                              onChange={(selected) =>
                                setFieldValue(
                                  "types",
                                  selected.map((option) => option.value)
                                )
                              }
                              onInputChange={(inputValue) => {
                                const query = inputValue.toLowerCase();

                                const filtered = allTypes
                                  .filter((option) =>
                                    option.label.toLowerCase().includes(query)
                                  )
                                  .sort((a, b) => {
                                    const aLabel = a.label.toLowerCase();
                                    const bLabel = b.label.toLowerCase();

                                    // Exact matches come first
                                    if (aLabel === query && bLabel !== query)
                                      return -1;
                                    if (aLabel !== query && bLabel === query)
                                      return 1;

                                    // Otherwise, keep alphabetical
                                    return aLabel.localeCompare(bLabel);
                                  });

                                setFilteredTypes(filtered);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && e.target.value) {
                                  const newType = e.target.value.trim();
                                  if (
                                    newType &&
                                    !allTypes.some(
                                      (option) => option.value === newType
                                    )
                                  ) {
                                    const newOption = {
                                      label: newType,
                                      value: newType,
                                    };
                                    setAllTypes((prev) => [...prev, newOption]);
                                    setFilteredTypes((prev) => [
                                      ...prev,
                                      newOption,
                                    ]);
                                    setFieldValue("types", [
                                      ...values.types,
                                      newType,
                                    ]);
                                  }
                                  e.preventDefault(); // Prevent the default behavior of the Enter key
                                }
                              }}
                              placeholder="Select or create a type..."
                              isMulti
                              isSearchable
                            />
                            {/* ErrorMessage corrected to "types" */}
                            <ErrorMessage
                              name="types"
                              component="div"
                              className="error text-danger"
                            />
                          </>
                        )}
                      </div>
                    </div>

                    {/* address */}
                    <div className="col-12 col-md-12 col-lg-12">
                      <div className="form-group">
                        <label className="form-label">Address</label>
                        <div className="col-12 col-md-12 col-lg-12 mb-3">
                          <div className="form-group">
                            <Field
                              name="address"
                              type="text"
                              className="form-input"
                              placeholder="Address"
                            />
                            <ErrorMessage
                              name="address"
                              component="div"
                              className="error text-danger"
                            />
                            <p
                              className="note text-muted"
                              style={{
                                fontSize: "0.800rem",
                                marginTop: "10px",
                              }}
                            >
                              Note: Please enter your complete address,
                              including building number, street name, city,
                              state, country, and postal code.
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 col-md-6 col-lg-6 mb-3">
                            <Field
                              name="street"
                              type="text"
                              className="form-input"
                              placeholder="street"
                            />{" "}
                            <ErrorMessage
                              name="street"
                              component="div"
                              className="error text-danger"
                            />
                          </div>
                          <div className="col-12 col-md-6 col-lg-6 mb-3">
                            <Field
                              name="city"
                              type="text"
                              className="form-input"
                              placeholder="City"
                            />
                            <ErrorMessage
                              name="city"
                              component="div"
                              className="error text-danger"
                            />
                          </div>
                          <div className="col-12 col-md-6 col-lg-6 mb-3">
                            <Field
                              name="state"
                              type="text"
                              className="form-input"
                              placeholder="State / Province / Region"
                            />
                            <ErrorMessage
                              name="state"
                              component="div"
                              className="error text-danger"
                            />
                          </div>
                          <div className="col-12 col-md-6 col-lg-6 mb-3">
                            <Field
                              name="postal_code"
                              type="text"
                              className="form-input"
                              placeholder="Postal code / Zip code"
                            />
                            <ErrorMessage
                              name="postal_code"
                              component="div"
                              className="error text-danger"
                            />
                          </div>
                          <div className="col-12 col-md-6 col-lg-6 mb-3">
                            <Field
                              name="county"
                              type="text"
                              className="form-input"
                              placeholder="County"
                            />
                            <ErrorMessage
                              name="county"
                              component="div"
                              className="error text-danger"
                            />
                          </div>
                          <div className="col-12 col-md-6 col-lg-6 mb-3">
                            <Field name="iso_code">
                              {({ field, form }) => (
                                <input
                                  {...field}
                                  type="text"
                                  className="form-input"
                                  placeholder="Country ISO code"
                                  maxLength={3}
                                  onChange={(e) => {
                                    // Uppercase only and remove non-letters
                                    const val = e.target.value
                                      .toUpperCase()
                                      .replace(/[^A-Z]/g, "");
                                    form.setFieldValue("iso_code", val);
                                  }}
                                />
                              )}
                            </Field>

                            <ErrorMessage
                              name="iso_code"
                              component="div"
                              className="error text-danger"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mb-4">
                      <div className="form-group">
                        <label className="form-label">Business Status</label>
                        <Field
                          as="select"
                          name="business_status"
                          className="form-select"
                        >
                          <option value="">Select Business Status</option>
                          <option value="Operational">Operational</option>
                          <option value="Closedtemporarily">
                            Closed Temporarily
                          </option>
                          <option value="Closedpermanently">
                            Closed Permanently
                          </option>
                        </Field>
                        <ErrorMessage
                          name="business_status"
                          component="div"
                          className="error text-danger"
                        />
                      </div>
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
                            {photos && photos.length > 0 ? (
                              photos.map((file, index) => (
                                <div
                                  key={index}
                                  className="uploaded-file row py-2"
                                >
                                  <div className="col">
                                    <span>{file.name}</span>
                                  </div>
                                  <div className="col">
                                    <button
                                      type="button"
                                      className="remove-btn btn btn-sm btn-sm"
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

                            {photoError && (
                              <div className="error text-danger">
                                {photoError}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Add note below the file upload section */}
                      <p
                        className="note text-muted"
                        style={{ fontSize: "0.875rem" }}
                      >
                        Note: Upload images in JPEG, PNG, GIF, or SVG format,
                        max 5MB, and between 800x600 pixels.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-12 col-lg-6 mb-4">
                  <div className="row">
                    {/* phone */}
                    <div className="col-12 col-md-12 col-lg-12 mb-3">
                      <div className="form-group">
                        <label className="form-label">Phone number</label>
                        <div className="d-flex gap-2">
                          {/* Country Code Select */}
                          <Field
                            as="select"
                            name="code"
                            className="form-control w-25"
                          >
                            <option value="+1">+1 (USA)</option>
                            <option value="+91">+91 (India)</option>
                            <option value="+44">+44 (UK)</option>
                            <option value="+61">+61 (Australia)</option>
                            <option value="+81">+81 (Japan)</option>
                          </Field>

                          {/* Phone Number Input */}
                          <Field
                            name="phone_number"
                            type="Number"
                            className="form-input w-75"
                            placeholder="Phone number"
                          />
                        </div>
                        <ErrorMessage
                          name="phone_number"
                          component="div"
                          className="error text-danger"
                        />
                      </div>
                    </div>
                    {/* place link */}
                    <div className="col-12 col-md-12 col-lg-12 mb-3">
                      <div className="form-group">
                        <label className="form-label">Place Link</label>
                        <Field
                          name="place_link"
                          type="url"
                          className="form-input"
                          placeholder="Place map link"
                        />
                        <ErrorMessage
                          name="place_link"
                          component="div"
                          className="error text-danger"
                        />
                      </div>
                    </div>
                    {/* rating */}

                    <div className="col-12 col-md-6 col-lg-6 mb-4">
                      <div className="form-group">
                        <label className="form-label">Rating</label>
                        <div className="position-relative">
                          <Field
                            name="rating"
                            type="number"
                            step="0.1"
                            className="form-input pe-5"
                            placeholder="Enter number of ratings"
                          />

                          <Star
                            className="ratingInputStar"
                            style={{
                              position: "absolute",
                              top: "50%",
                              right: "10px",
                              transform: "translateY(-50%)",
                              pointerEvents: "none",
                            }}
                          />
                        </div>
                        <ErrorMessage
                          name="rating"
                          component="div"
                          className="error text-danger"
                        />
                      </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-6 mb-4">
                      <div className="form-group">
                        <label className="form-label">Review</label>
                        <Field
                          name="reviews"
                          type="number"
                          className="form-input"
                          placeholder="Enter number of reviews"
                        />

                        <ErrorMessage
                          name="reviews"
                          component="div"
                          className="error text-danger"
                        />
                      </div>
                    </div>
                    {/* working hours */}
                    <div className="col-12 col-md-12 col-lg-12 mb-4">
                      <div className="form-group">
                        <label className="form-label">Working hours</label>
                      </div>
                    </div>
                    {/* fields */}
                    {/* Working HOurs section */}

                    <FieldArray name="working_hours">
                      {({ push, remove }) => (
                        <div className="custom-days">
                          {values.working_hours.map((day, index) => (
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
                                        (item, idx) =>
                                          item.day === dayName && idx !== index
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
                              <div className="w-25">
                                <Field
                                  type="time"
                                  name={`working_hours[${index}].startTime`}
                                  className="form-control"
                                  disabled={day.is24Hours}
                                />
                                <ErrorMessage
                                  name={`working_hours[${index}].startTime`}
                                  component="div"
                                  className="text-danger"
                                />
                              </div>

                              {/* End Time */}
                              <div className="w-25">
                                <Field
                                  type="time"
                                  name={`working_hours[${index}].endTime`}
                                  className="form-control"
                                  disabled={day.is24Hours}
                                />
                                <ErrorMessage
                                  name={`working_hours[${index}].endTime`}
                                  component="div"
                                  className="text-danger"
                                />
                              </div>

                              {/* 24 Hours Checkbox */}
                              <div className="form-check mt-2 d-flex align-items-center">
                                <Field
                                  type="checkbox"
                                  name={`working_hours[${index}].is24Hours`}
                                  checked={day.is24Hours}
                                  className="form-check-input"
                                  onChange={(e) => {
                                    setFieldValue(
                                      `working_hours[${index}].is24Hours`,
                                      e.target.checked
                                    );
                                    if (e.target.checked) {
                                      setFieldValue(
                                        `working_hours[${index}].startTime`,
                                        ""
                                      );
                                      setFieldValue(
                                        `working_hours[${index}].endTime`,
                                        ""
                                      );
                                    } else {
                                      // Set default times when 24Hrs is unselected
                                      setFieldValue(
                                        `working_hours[${index}].startTime`,
                                        "00:01"
                                      );
                                      setFieldValue(
                                        `working_hours[${index}].endTime`,
                                        "23:59"
                                      );
                                    }
                                  }}
                                />
                                <label className="form-check-label ms-2 mb-0">
                                  24 Hrs
                                </label>
                              </div>

                              {/* Add / Remove Buttons */}
                              <div className="d-flex flex-column mt-1">
                                {index === 0 &&
                                  values.working_hours.length < 7 && (
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
                                {values.working_hours.length > 1 &&
                                  index !== 0 && (
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
                </div>
                {/* Submit Button */}

                {/* form button */}
                <div className="col-12 col-md-12 col-lg-12">
                  <div className="vbtns">
                    <button className="theme-btn btn-border" type="button">
                      Clear
                    </button>
                    <button
                      className="theme-btn btn-main"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <i
                            className="fa fa-spinner fa-spin"
                            style={{ marginRight: 8 }}
                          ></i>{" "}
                          Saving...
                        </>
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {console.log(errors, "formik errors")}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddBusiness;
