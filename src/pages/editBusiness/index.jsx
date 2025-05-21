import { useState, useRef, useEffect } from "react";
import { data, Link ,useNavigate} from "react-router-dom";
import { Star, Add, Remove, Delete } from "@mui/icons-material";

import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { Spin } from "antd";
import { convert12hTo24h, convert24hTo12h, formatWeeklyHours } from "./constant";
import toast from "react-hot-toast";

const EditBusiness = () => {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const { _id } = useParams();
  const [allTypes, setAllTypes] = useState([]);
  const [filteredTypes, setFilteredTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingPhoto, setExistingPhoto] = useState([]);
  const [newPhoto, setNewPhoto] = useState([]);
  const [photoError, setPhotoError] = useState("");
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/jpg"];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const MAX_IMAGES = 5;
  const fileInputRef = useRef(null);
  const [workingHours, setWorkingHours] = useState([
    { day: "", startTime: "", endTime: "", is24Hours: false },
  ]);

  const [initialValues, setInitialValues] = useState({
    display_name: "",
    types: "",
    address: "",
    street: "",
    city: "",
    state: "",
    postal_code: "",
    county: "",
    country_code: "",
    // latitude: "",
    // longitude: "",
    phone: "",
    code:"",
    place_link: "",
    rating: "",
    reviews: "",
    business_status:"",
    working_hours: [
      {
        day: "",
        startTime: "",
        endTime: "",
        is24Hours: false,
      },
    ],
  });

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
        setFilteredTypes(options.slice(1, 10));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching types", err);
      }
    };
    fetchTypes();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseUrl}business/${_id}`);
        const data = res.data.data;
        const parsedTypes = Array.isArray(data.types)
          ? data.types
          : (() => {
              try {
                return JSON.parse(data.types || "[]");
              } catch {
                console.error("Invalid types format:", data.types);
                return [];
              }
            })();

        // Parse working hours safely
        const parsedWorkingHours = (() => {
          try {
            const fixedStr = (data.working_hours || "{}").replace(/'/g, '"');
            return JSON.parse(fixedStr);
          } catch {
            console.error("Invalid working_hours format:", data.working_hours);
            return {};
          }
        })();
        console.log("parsedWorkingHours", parsedWorkingHours)

        function cleanTimeString(time) {
          return time
            .toLowerCase()
            .replace(/[^0-9:.apm]/g, '')
            .replace(/(\s?am|\s?pm){2,}/g, '') 
            .replace(/\s+/g, '')               
            .replace(/(am|pm)/, ' $1')         
            .trim();
        }
  
        // Transform working hours
        const transformedWorkingHours = Object.entries(parsedWorkingHours).map(([day, value]) => {
          if (value === "Open 24 Hours") {
            return { day, startTime: "", endTime: "", is24Hours: true };
          } else if (value === "Closed") {
            return { day, startTime: "", endTime: "", is24Hours: false };
          } else if (typeof value === "string" && value.includes("-")) {
            const [start, end] = value.split("-");
            console.log(start, end, "my start and end")
            const cleanedStart = cleanTimeString(start);
            const cleanedEnd = cleanTimeString(end);
            
            return {
              day,
              startTime: convert12hTo24h(cleanedStart),
              endTime: convert12hTo24h(cleanedEnd),
              is24Hours: false,
            };
          } else {
            console.warn(`Unexpected value for day "${day}":`, value);
            return { day, startTime: "", endTime: "", is24Hours: false };
          }
        });

        console.log(transformedWorkingHours, "transformed working hours")
        
        const rawPhone = data.phone; 

        const cleanedPhone = rawPhone.replace(/\D/g, '');
        
        const phoneNumber = cleanedPhone.slice(-10);
        
        const countryCode = '+' + cleanedPhone.slice(0, cleanedPhone.length - 10);
        console.log('hello',data.business_status);
        setWorkingHours(transformedWorkingHours);
        setExistingPhoto(Array.isArray(data.photo) ? data.photo : []);
        setInitialValues({
          
          display_name: data.display_name || "",
          types: data.types || [],
          address: data.address || "",
          street: data.street || "",
          city: data.city || "",
          state: data.state || "",
          postal_code: data.postal_code || "",
          county: data.county || "",
          country_code: data.country_code || "",
          // latitude: data.latitude || "",
          // longitude: data.longitude || "",
          phone: phoneNumber || "",
          code: countryCode || "",
          photo: data.photo || "",
          place_link: data.gmb_link || "",
          rating: data.rating || "",
          reviews: data.reviews || "",
          working_hours: transformedWorkingHours || [],
          business_status: data.business_status || "",
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching offer data:", err);
        setLoading(false);
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
    if (files.length + (newPhoto?.length || 0) > MAX_IMAGES) {
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
      setPhotoError(""); // Clear error if validation passes
      setNewPhoto((prevPhotos) => [...(prevPhotos || []), ...resizedImages]);
    }
  };

  const handleRemoveNewImage = (indexToRemove) => {
    setNewPhoto((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleWorkingHoursChange = (index, field, value) => {
    setWorkingHours((prevHours) =>
      prevHours.map((day, i) =>
        i === index
          ? {
              ...day,
              [field]: value,
              ...(field === "is24Hours" && value
                ? { startTime: "", endTime: "" } // Clear start and end times if 24 Hours is checked
                : {}),
            }
          : day
      )
    );
  };

  const handleAddDay = () => {
    setWorkingHours([...workingHours, { day: "", startTime: "", endTime: "" }]);
  };

  const handleRemoveDay = (index) => {
    const updatedDays = [...workingHours];
    updatedDays.splice(index, 1);
    setWorkingHours(updatedDays);
  };

  const handleSubmit = async (values, { resetForm }) => {

    const updatedTime = values.working_hours.map((date) => ({
      day: date.day,
      startTime: convert24hTo12h(date.startTime),
      endTime: convert24hTo12h(date.endTime),
      is24Hours: date.is24Hours,
    }));
    console.log(updatedTime);
    const formData = new FormData();
    formData.append("display_name", values.display_name);
    formData.append("types", values.types);
    formData.append("address", values.address);
    formData.append("street", values.street);
    formData.append("city", values.city);
    formData.append("state", values.state);
    formData.append("postal_code", values.postal_code);
    formData.append("county", values.county);
    formData.append("country_code", values.country_code);
    formData.append("phone", values.code+values.phone);
    formData.append("place_link", values.place_link || "");
    formData.append("rating", values.rating || "");
    formData.append("reviews", values.reviews || "");
    formData.append("business_status", values.business_status || "");

    // formData.append("working_hours", JSON.stringify(updatedTime));
    formData.append("working_hours", JSON.stringify(formatWeeklyHours(updatedTime)));
    formData.append("existingPhoto", JSON.stringify(existingPhoto));

    if (newPhoto.length > 0) {
      newPhoto.forEach((file) => formData.append("newPhoto", file));
    }

    try {
      const response = await axios.put(`${baseUrl}business/${_id}`, formData);
    
      if (response.status === 200) {
        toast.success('Business updated successfully');
        setTimeout(() => {
          navigate('/business-listings'); 
        }, 1500);
      }
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error('Something went wrong while updating business');
    }
    
  };

  const handleImageDelete = async (url) => {
    try {
      const deleteUrl = `${baseUrl}business/${_id}/image`;

      const deleteResponse = await axios.delete(deleteUrl, {
        data: { imageUrl: url },
      });

      console.log("Image URL:", url);
      console.log("Delete Response:", deleteResponse);

      // Optionally, update the UI to remove the deleted image
      // For example, you can filter out the deleted image from the existingImages array
      setExistingPhoto((prevImages) =>
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
          <h2 className="page-heading">Edit Business</h2>
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
        {loading === true ? (
          <Spin />
        ) : (
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={Yup.object({
              display_name: Yup.string().required("Title is required"),
              // Add other validations here
            })}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
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
                            className="error"
                          />
                        </div>
                      </div>
                      {/* types */}
                      <div className="col-12 col-md-12 col-lg-12 mb-3">
                        <div className="form-group">
                          <label className="form-label">Types</label>
                          {loading === true ? (
                            "Data Fetching"
                          ) : (
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
                                const filtered = allTypes.filter((option) =>
                                  option.label
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                                );
                                setFilteredTypes(filtered.slice(0, 20));
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
                          )}
                        </div>
                      </div>

                      {/* address */}
                      <div className="col-12 col-md-12 col-lg-12">
                        <div className="form-group">
                          <label className="form-label">Address</label>
                          <div className="row">
                            <div className="col-12 col-md-6 col-lg-6 mb-3">
                              <Field
                                name="address"
                                type="text"
                                className="form-input"
                                placeholder="Address line 1"
                              />
                            </div>
                            <div className="col-12 col-md-6 col-lg-6 mb-3">
                              <Field
                                name="street"
                                type="text"
                                className="form-input"
                                placeholder="Address line 2"
                              />
                            </div>
                            <div className="col-12 col-md-6 col-lg-6 mb-3">
                              <Field
                                name="city"
                                type="text"
                                className="form-input"
                                placeholder="City"
                              />
                            </div>
                            <div className="col-12 col-md-6 col-lg-6 mb-3">
                              <Field
                                name="state"
                                type="text"
                                className="form-input"
                                placeholder="State / Province / Region"
                              />
                            </div>
                            <div className="col-12 col-md-6 col-lg-6 mb-3">
                              <Field
                                name="postal_code"
                                type="text"
                                className="form-input"
                                placeholder="Postal code / Zip code"
                              />
                            </div>
                            <div className="col-12 col-md-6 col-lg-6 mb-3">
                              <Field
                                name="county"
                                type="text"
                                className="form-input"
                                placeholder="County"
                              />
                            </div>
                            <div className="col-12 col-md-6 col-lg-6 mb-3">
                              <Field
                                name="country_code"
                                type="text"
                                className="form-input"
                                placeholder="CA"
                              />
                            </div>
                            {/* <div className="col-12 col-md-6 col-lg-6 mb-3">
                            <Field
                              as="select"
                              name="business_status"
                              className="form-select"
                            >
                              
                              <option value="">Select status</option>
                              <option value="Operational">Operational</option>
                              <option value="Closedtemporarily">
                                Closed Temporarily
                              </option>
                              <option value="Closedpermanently">
                                Closed Permanently
                              </option>
                            </Field>
                            {/* <ErrorMessage
                              name="buisness_status"
                              component="div"
                              className="error text-danger"
                            /> *
                          </div> */}
                          </div>
                        </div>
                      </div>
                      <div className="col-12 mb-4">
  <div className="form-group">
    <label className="form-label">Business Status</label>
    <Field
      as="select"
      name="buisness_status"
      className="form-select"
    >
      <option value="">Select Business Status</option>
      <option value="Operational">Operational</option>
      <option value="Closedtemporarily">Closed Temporarily</option>
      <option value="Closedpermanently">Closed Permanently</option>
    </Field>
    <ErrorMessage
      name="buisness_status"
      component="div"
      className="error text-danger"
    />
  </div>
</div>
                      {/* Latitude */}
                      {/* <div className="col-12 col-md-12 col-lg-6 mb-3">
                        <div className="form-group">
                          <label className="form-label">Latitude</label>
                          <Field
                            name="latitude"
                            type="text"
                            className="form-input"
                            placeholder="Latitude"
                          />
                        </div>
                      </div> */}
                      {/* Longitude */}
                      {/* <div className="col-12 col-md-12 col-lg-6 mb-3">
                        <div className="form-group">
                          <label className="form-label">Longitude</label>
                          <Field
                            name="longitude"
                            type="text"
                            className="form-input"
                            placeholder="Longitude"
                          />
                        </div>
                      </div> */}
                      {/* image */}
                      <div className="col-12 col-md-12 col-lg-12 mb-3">
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
                                accept=".jpeg, .png, .gif, .svg"
                                onChange={handleFileChange}
                                multiple
                                style={{ display: "none" }}
                              />
                            </label>

                            <div className="file-info">
                              {/* Existing images */}
                              {existingPhoto.length > 0 &&
                                existingPhoto.map((url, index) => (
                                  <div
                                    key={`existing-${index}`}
                                    className="uploaded-file row py-2"
                                  >
                                    <div className="col">
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

                              {/* New images */}
                              {newPhoto.length > 0 &&
                                newPhoto.map((file, index) => (
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
                                          handleRemoveNewImage(index)
                                        }
                                      >
                                        <Delete className="text-danger" />
                                      </button>
                                    </div>
                                  </div>
                                ))}

                              {existingPhoto.length === 0 &&
                                newPhoto.length === 0 && (
                                  <p>Choose files or drag and drop here</p>
                                )}
                            </div>
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
                  </div>
                  <div className="col-12 col-md-12 col-lg-6 mb-4">
                    <div className="row">
                      {/* phone */}
                      <div className="col-12 col-md-12 col-lg-12 mb-3">
                      <div className="form-group">
                        <label className="form-label">Phone number</label>
                        <div className="d-flex gap-2">
                          {/* Country Code Select */}
                          <Field as="select" name="code" className="form-control w-25">
                            <option value="+1">+1 (USA)</option>
                            <option value="+91">+91 (India)</option>
                            <option value="+44">+44 (UK)</option>
                            <option value="+61">+61 (Australia)</option>
                            <option value="+81">+81 (Japan)</option>
                          </Field>

                          {/* Phone Number Input */}
                          <Field
                            name="phone"
                            type="Number"
                            className="form-input w-75"
                            placeholder="Phone number"
                          />
                          
                        </div>
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="error text-danger"
                        />
                      </div>
                    </div>
                      {/* place link */}
                      <div className="col-12 col-md-12 col-lg-12 mb-3">
                        <div className="form-group">
                          <label className="form-label">Place map link</label>
                          <Field
                            name="place_link"
                            type="text"
                            className="form-input"
                            placeholder="Place map link"
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

                      {/* <div className="col-12 col-md-12 col-lg-6 mb-3">
                      <div className="form-group">
                        <label className="form-label">Rating</label>
                        <div className="ratinginput">
                          <div className="position-relative">
                            <Field
                              name="rating"
                              type="text"
                              className="form-input"
                              placeholder="0"
                            />
                            <Star className="ratingInputStar" />
                            <ErrorMessage
                              name="rating"
                              component="div"
                              className="error text-danger"
                            />
                          </div>
                           <div className="position-relative">
                            <Field
                              name="rating"
                              type="text"
                              className="form-input "
                              placeholder="000"
                            />
                            <ErrorMessage
                              name="rating"
                              component="div"
                              className="error text-danger"
                            />
                          </div> 
                        </div>
                      </div>
                    </div> */}
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

                      {/* Custom days section */}
                      <div className="col-12 col-md-12 col-lg-12 mb-4">
                        <div className="form-group">
                          <label className="form-label">Working hours</label>
                        </div>
                      </div>
                      <FieldArray name="working_hours">
                        {({ push, remove }) => (
                          <div className="custom-days">
                            {/* {console.info("WORKING HOURS", workingHours)} */}
                            {(values.working_hours) &&
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
                                      {console.log("daysOfWeek", daysOfWeek)}
                                      {daysOfWeek.map((dayName) => (
                                        <option
                                          key={dayName}
                                          value={dayName}
                                          disabled={values.working_hours.some(
                                            (item, idx) =>
                                              item.day === dayName &&
                                              idx !== index
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
              {/* Show 12hr format */}
              {/* <span className="ms-2">
                {day.startTime ? convert24hTo12h(day.startTime) : ""}
              </span> */}
            </div>

            {/* End Time */}
            <div className="w-25 d-flex align-items-center">
              <Field
                type="time"
                name={`working_hours[${index}].endTime`}
                className="form-control"
                disabled={day.is24Hours}
              />
              {/* Show 12hr format */}
              {/* <span className="ms-2">
                {day.endTime ? convert24hTo12h(day.endTime) : ""}
              </span> */}
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
        setFieldValue(`working_hours[${index}].startTime`, "");
        setFieldValue(`working_hours[${index}].endTime`, "");
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

                      {/* <div className="custom-days">
                        <label className="form-label">Working hours</label>

                        {workingHours.map((day, index) => (
                          <div
                            key={index}
                            className="custom-day-row mb-2 d-flex gap-2"
                          >
                            <Field
                              as="select"
                              name="working_hours"
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
                              <option value="Monday">Monday</option>
                              <option value="Tuesday">Tuesday</option>
                              <option value="Wednesday">Wednesday</option>
                              <option value="Thursday">Thursday</option>
                              <option value="Friday">Friday</option>
                              <option value="Saturday">Saturday</option>
                              <option value="Sunday">Sunday</option>
                            </Field>

                            <Field
                              className="form-control w-25"
                              type="time"
                              placeholder="Start Time"
                              value={day.startTime}
                              disabled={day.is24Hours} // Disable if 24 Hours is checked
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
                              disabled={day.is24Hours} // Disable if 24 Hours is checked
                              onChange={(e) =>
                                handleWorkingHoursChange(
                                  index,
                                  "endTime",
                                  e.target.value
                                )
                              }
                            />
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={day.is24Hours} // Bind to is24Hours property
                                onChange={(e) =>
                                  handleWorkingHoursChange(
                                    index,
                                    "is24Hours",
                                    e.target.checked
                                  )
                                }
                                id={`24hours-${index}`}
                              />
                              <label
                                className="form-check-label ms-2"
                                htmlFor={`24hours-${index}`}
                              >
                                24 Hours
                              </label>
                            </div>

                            {index === 0 && (
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
                      </div> */}
                    </div>
                  </div>
                  {/* Submit Button */}

                  {/* form button */}
                  <div className="col-12 col-md-12 col-lg-12">
                    <div className="vbtns">
                      <button className="theme-btn btn-border" type="button">
                        Clear
                      </button>
                      <button className="theme-btn btn-main" type="submit">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default EditBusiness;
