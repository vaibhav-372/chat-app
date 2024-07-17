import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

const RegisterForm = ({ initialValues, validationSchema, onSubmit }) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ handleChange, handleBlur, values, isSubmitting }) => (
        <>
          <h2 className="text-2xl font-bold mb-4">Register</h2>
          <Form className="mb-3 w-full max-w-sm">
            <div className="mb-4">
              <Field
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-input w-full px-4 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>
            <div className="mb-4">
              <Field
                type="text"
                name="name"
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-input w-full px-4 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>
            <div className="mb-4">
              <Field
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-input w-full px-4 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>
            <div className="mb-4">
              <Field
                type="password"
                name="confirmPassword"
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-input w-full px-4 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm password"
              />
              <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
            </div>
            <div className="w-full">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                Send OTP
              </button>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default RegisterForm;
