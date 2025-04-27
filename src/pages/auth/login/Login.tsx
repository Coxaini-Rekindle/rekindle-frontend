import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const [password, setPassword] = useState("");
  const [errors, setErrors] = React.useState({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the login logic
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
    <div className="flex flex-col w-full justify-center items-center gap-6 px-4 py-12">
      <div className="px-4 py-12 rounded-xl w-full max-w-md backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border border-gray-400/50 dark:border-gray-700/50">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            Welcome Back
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Sign in to continue your journey with Rekindle
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
              onValueChange={setPassword}
            />
            <div className="flex justify-end">
              <Link
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                to="/forgot-password"
              >
                Forgot password?
              </Link>
            </div>
            <Button
              className="w-full mt-2 py-3 rounded-md transition-all duration-200 hover:shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              color="primary"
              type="submit"
            >
              Sign In
            </Button>
          </div>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              to="/register"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>

      <div className="max-w-md w-full text-center px-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Rekindle - Reconnect with What Matters
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          A social platform designed to help you rebuild and strengthen
          meaningful connections. Rediscover old friends, nurture existing
          relationships, and create lasting bonds.
        </p>
      </div>
    </div>
  );
};

export default Login;
