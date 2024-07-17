import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

const OtpVerificationForm = ({ otpInitialValues, otpValidationSchema, onSubmit }) => {
  return (
    <Formik
      initialValues={otpInitialValues}
      validationSchema={otpValidationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, handleChange, handleBlur, values }) => (
        <>
          <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
          <Form className="mb-3 w-full max-w-sm">
            <div className="mb-4">
              <Field
                type="text"
                name="otp"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.otp}
                className="form-input w-full px-4 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter OTP"
              />
              <ErrorMessage name="otp" component="div" className="text-red-500 text-sm" />
            </div>
            <div className="w-full">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isSubmitting}
              >
                Verify OTP
              </button>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default OtpVerificationForm;
