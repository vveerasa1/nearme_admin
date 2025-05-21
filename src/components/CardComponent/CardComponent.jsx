import React from "react";

const CardComponent = ({ title, description, discountType, discountValue, dateRange, activeTime, customDays }) => {
  const formatDate = (date) => {
    if (!date) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="fw-semibold">{title}</h5>
        <p className="text-muted">{description}</p>

        {(discountType === "Discount" || discountType === "Deal") && (
          <div className="mb-2">
            <strong>{discountType}:</strong> {discountValue}
            {discountType === "Discount" ? "%" : ""}
          </div>
        )}

        <div className="mb-2">
          <strong>Valid:</strong> {formatDate(dateRange?.startDate)} {activeTime?.startTime} -{" "}
          {formatDate(dateRange?.endDate)} {activeTime?.endTime}
        </div>

        {customDays?.length > 0 && (
          <div className="mt-3">
            <strong>Offer Timing:</strong>
            <ul className="mt-2">
              {customDays.map((day, index) => (
                <li key={index}>
                  {day.day}: {day.startTime} - {day.endTime}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardComponent;