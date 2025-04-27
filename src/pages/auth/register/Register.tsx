import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import RegisterSideBar from "./RegisterSideBar";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = React.useState({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the registration logic
    console.log("Registration data:", { username, email, password });
  };

  const getPasswordError = (value: string) => {
    if (value.length < 4) {
      return "Password must be 4 characters or more";
    }
    if ((value.match(/[A-Z]/g) || []).length < 1) {
      return "Password needs at least 1 uppercase letter";
    }
    if ((value.match(/[^a-z]/gi) || []).length < 1) {
      return "Password needs at least 1 symbol";
    }

    return null;
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* Sidebar for desktop view - hidden on mobile */}
      <div className="hidden lg:flex">
        <RegisterSideBar className="bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800" />
      </div>

      <div className="flex flex-col w-full justify-center items-center px-4 py-12">
        <div className="rounded-xl p-8 w-full max-w-md backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border border-gray-400/50 dark:border-gray-700/50">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              Create Your Account
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Join Rekindle and begin your journey
            </p>
          </div>

          <Form
            className="w-full justify-center items-center space-y-5"
            validationErrors={errors}
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-4 w-full">
              <Input
                isRequired
                className="rounded-md"
                errorMessage={({ validationDetails }) => {
                  if (validationDetails.valueMissing) {
                    return "Please enter your username";
                  }
                }}
                label="Username"
                labelPlacement="outside"
                name="username"
                placeholder="Enter your username"
                type="text"
                value={username}
                onValueChange={setUsername}
              />
              <Input
                isRequired
                className="rounded-md"
                errorMessage={({ validationDetails }) => {
                  if (validationDetails.valueMissing) {
                    return "Please enter your email";
                  }
                  if (validationDetails.typeMismatch) {
                    return "Please enter a valid email address";
                  }
                }}
                label="Email"
                labelPlacement="outside"
                name="email"
                placeholder="Enter your email"
                type="email"
                value={email}
                onValueChange={setEmail}
              />
              <Input
                isRequired
                className="rounded-md"
                errorMessage={getPasswordError(password)}
                label="Password"
                labelPlacement="outside"
                name="password"
                placeholder="Enter your password"
                type="password"
                value={password}
                onValueChange={setPassword}
              />

              <Button
                className="w-full mt-2 py-3 rounded-md transition-all duration-200 hover:shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                color="primary"
                type="submit"
              >
                Create Account
              </Button>
            </div>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                to="/login"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar for mobile view - hidden on desktop */}
      <div className="block lg:hidden w-full mt-1">
        <RegisterSideBar className="rounded-t-xl" />
      </div>
    </div>
  );
};

export default Register;
