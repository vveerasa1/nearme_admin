import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Add, Remove, Delete } from "@mui/icons-material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { Spin } from "antd";

const EditBusiness = () => {
  const { _id } = useParams();
  const [allTypes, setAllTypes] = useState([]);
  const [filteredTypes, setFilteredTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingPhoto, setExistingPhoto] = useState([]);
  const [newPhoto, setNewPhoto] = useState([]);
  const [photoError, setPhotoError] = useState("");

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
    latitude: "",
    longitude: "",
    phone: "",
    photo: [],
    place_link: "",
    rating: "",
    reviews: "",
    working_hours: "",
  });

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4001/business/types"
        );
        const options = response.data.data.map((type) => ({
          label: type,
          value: type,
        }));
        setAllTypes(options);
        setFilteredTypes(options);
      } catch (err) {
        console.error("Error fetching types:", err);
      }
    };

    fetchTypes();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:4001/business/${_id}`);
        const data = res.data.data;

        console.log("Fetched Data:", data); // Debugging: Check fetched data

        //   const parsedTypes = Array.isArray(data.types)
        //   ? data.types
        //   : (() => {
        //       console.log("Raw types data:", data.types); // Debugging: Check raw data
        //       return JSON.parse(data.types || "[]");
        //     })();

        const parsedWorkingHours = (() => {
          console.log("Raw working_hours data:", data.working_hours); // Debugging: Check raw data
          return JSON.parse(data.working_hours || "{}");
        })();

        const transformedWorkingHours = Object.keys(parsedWorkingHours).map(
          (day) => {
            const value = parsedWorkingHours[day];
            if (value === "Open 24 Hours") {
              return { day, startTime: "", endTime: "", is24Hours: true };
            } else if (value === "Closed") {
              return { day, startTime: "", endTime: "", is24Hours: false };
            } else {
              const [startTime, endTime] = value.split(" - ");
              return { day, startTime, endTime, is24Hours: false };
            }
          }
        );

        setWorkingHours(transformedWorkingHours);
        setExistingPhoto(data.photo || []); // Set existing photos
        setInitialValues({
          display_name: data.display_name || "",
          types: data.types || [], // Directly set the types array
          address: data.address || "",
          street: data.street || "",
          city: data.city || "",
          state: data.state || "",
          postal_code: data.postal_code || "",
          county: data.county || "",
          country_code: data.country_code || "",
          latitude: data.latitude || "",
          longitude: data.longitude || "",
          phone: data.phone || "",
          photo: data.photo || "",
          place_link: data.place_link || "",
          rating: data.rating || "",
          reviews: data.reviews || "",
          working_hours: data.working_hours || "",
        });

        console.log("Initial Values Set:", {
          display_name: data.display_name || "",
          // types: parsedTypes || "",
          address: data.address || "",
          street: data.street || "",
          city: data.city || "",
          state: data.state || "",
          postal_code: data.postal_code || "",
          county: data.county || "",
          country_code: data.country_code || "",
          latitude: data.latitude || "",
          longitude: data.longitude || "",
          phone: data.phone || "",
          photo: data.photo || "",
          place_link: data.place_link || "",
          rating: data.rating || "",
          reviews: data.reviews || "",
          working_hours: parsedWorkingHours,
        });

        setLoading(false);
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
    const formattedWorkingHours = workingHours.reduce((acc, day) => {
      if (day.is24Hours) {
        acc[day.day] = "Open 24 Hours";
      } else if (!day.startTime && !day.endTime) {
        acc[day.day] = "Closed";
      } else {
        acc[day.day] = `${day.startTime} - ${day.endTime}`;
      }
      return acc;
    }, {});
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
    formData.append("latitude", values.latitude);
    formData.append("longitude", values.longitude);
    formData.append("phone", values.phone);
    formData.append("place_link", values.place_link || "");
    formData.append("rating", values.rating || "");
    formData.append("reviews", values.reviews || "");
    formData.append("working_hours", JSON.stringify(formattedWorkingHours));

    formData.append("existingPhoto", JSON.stringify(existingPhoto));

    if (newPhoto.length > 0) {
      newPhoto.forEach((file) => formData.append("newPhoto", file));
    }

    try {
      const response = await axios.put(
        `http://localhost:4001/business/${_id}`,
        formData
      );
      console.log("Business submitted:", response.data);
      setNewPhoto([]);
      setWorkingHours([{ day: "", startTime: "", endTime: "" }]);
      if (fileInputRef.current) fileInputRef.current.value = null;
      resetForm();
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  const handleImageDelete = async (url) => {
    try {
      const deleteUrl = `http://localhost:4001/business/${_id}/image`; // Ensure _id is defined

      const deleteResponse = await axios.delete(deleteUrl, {
        data: { imageUrl: url }, // Pass imageUrl in the data object
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
                      <CreatableSelect
                        name="types"
                        options={filteredTypes}
                        value={
                          values.types.length > 0 &&
                          values.types.map((type) => ({
                            label: type,
                            value: type,
                          }))
                        }
                        onChange={(selected) =>
                          setFieldValue(
                            "types",
                            selected.map((option) => option.value) // Convert back to an array of strings
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
                              !values.types.includes(newType) // Ensure no duplicates
                            ) {
                              setFieldValue("types", [
                                ...values.types,
                                newType,
                              ]); // Add new type to the array
                            }
                            e.preventDefault(); // Prevent the default behavior of the Enter key
                          }
                        }}
                        placeholder="Select or create a type..."
                        isMulti
                        isSearchable
                      />
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
                          </div>
                        </div>
                      </div>
                      {/* Latitude */}
                      <div className="col-12 col-md-12 col-lg-6 mb-3">
                        <div className="form-group">
                          <label className="form-label">Latitude</label>
                          <Field
                            name="latitude"
                            type="text"
                            className="form-input"
                            placeholder="Latitude"
                          />
                        </div>
                      </div>
                      {/* Longitude */}
                      <div className="col-12 col-md-12 col-lg-6 mb-3">
                        <div className="form-group">
                          <label className="form-label">Longitude</label>
                          <Field
                            name="longitude"
                            type="text"
                            className="form-input"
                            placeholder="Longitude"
                          />
                        </div>
                      </div>
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
                              {console.log(existingPhoto)}
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
                              name="country_code"
                              className="form-control w-25"
                            >
                              <option value="+1">+1 (USA)</option>
                              <option value="+91">+91 (India)</option>
                              <option value="+44">+44 (UK)</option>
                              <option value="+61">+61 (Australia)</option>
                              <option value="+81">+81 (Japan)</option>
                              {/* Add more country codes as needed */}
                            </Field>

                            {/* Phone Number Input */}
                            <Field
                              name="phone"
                              type="number"
                              className="form-input w-75"
                              placeholder="Phone number"
                            />
                          </div>
                        </div>
                      </div>
                      {/* place link */}
                      <div className="col-12 col-md-12 col-lg-12 mb-3">
                        <div className="form-group">
                          <label className="form-label">Place Link</label>
                          <Field
                            name="place_link"
                            type="text"
                            className="form-input"
                            placeholder="Place Link"
                          />
                        </div>
                      </div>
                      {/* rating */}
                      <div className="col-12 col-md-6 col-lg-6 mb-3">
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
                            </div>
                            <div className="position-relative">
                              <Field
                                name="rating"
                                type="text"
                                className="form-input "
                                placeholder="000"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-lg-6 mb-4">
                        <div className="form-group">
                          <label className="form-label">Review</label>
                          <Field
                            name="reviews"
                            type="text"
                            className="form-input"
                            placeholder=""
                          />
                        </div>
                      </div>
                      {/* working hours */}

                      {/* Custom days section */}
                      <div className="custom-days">
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
                      </div>
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
