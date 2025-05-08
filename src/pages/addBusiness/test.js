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
                          <option>Deal</option>
                          <option>Discount</option>
                          <option>Coupon</option>
                        </Field>
                      </div>
                      {/* discount */}
                      <div className="mt-4">
                        <label className="form-label">Percentage</label>
                        <Field
                          name="discountValue"
                          type="text"
                          className="form-input"
                          placeholder="%"
                        />
                      </div>
                    </div>
                    {/* image */}
                    <div className="col-12 col-md-12 col-lg-12 mb-3">
                      <div className="form-group">
                        <label className="form-label">Image</label>
                        <div className="file-upload-container">
                          <label htmlFor="fileUpload">
                            <input
                              type="file"
                              id="fileUpload"
                              ref={fileInputRef}

                              accept=".jpeg, .png, .gif, .svg"
                              onChange={handleFileChange}
                            />
                            Upload File
                          </label>
                          <p className="file-info">
                            {image ? (
                              <span>Selected File: {image.name}</span>
                            ) : (
                              "Choose a file or drag and drop it here"
                            )}
                          </p>
                        </div>
                        <p className="form-note">
                          Note: Upload images in JPEG, PNG, GIF, or SVG format,
                          max 5MB, and between 800x600 pixels.
                        </p>
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
              </div>
              {/* Submit Button */}
              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  Add Offer
                </button>
              </div>
            </Form>
          )}