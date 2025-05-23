import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdEmail, MdLock } from "react-icons/md";

import { useLogin } from "../../../hooks/useAuth";
import { useAuthStatus } from "../../../hooks/useAuthStatus";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();
  const { isAuthenticated } = useAuthStatus();
  const [errors] = React.useState({});

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate replace to="/" />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <div className="flex flex-col w-full justify-center items-center gap-6 px-4 py-12">
      <div className="px-4 py-12 rounded-xl w-full max-w-md backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border border-gray-400/50 dark:border-gray-700/50">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {t("login.title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t("login.subtitle")}
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
              endContent={
                <MdEmail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              errorMessage={({ validationDetails }) => {
                if (validationDetails.valueMissing) {
                  return t("login.validation.emailRequired");
                }
                if (validationDetails.typeMismatch) {
                  return t("login.validation.emailInvalid");
                }
              }}
              label={t("login.email")}
              labelPlacement="outside"
              name="email"
              placeholder={t("login.placeholders.email")}
              type="email"
              value={email}
              onValueChange={setEmail}
            />
            <Input
              isRequired
              className="rounded-md"
              endContent={
                <MdLock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              errorMessage={({ validationDetails }) => {
                if (validationDetails.valueMissing) {
                  return t("login.validation.passwordRequired");
                }
              }}
              label={t("login.password")}
              labelPlacement="outside"
              name="password"
              placeholder={t("login.placeholders.password")}
              type="password"
              onValueChange={setPassword}
            />
            <div className="flex justify-end">
              <Link
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                to="/forgot-password"
              >
                {t("login.forgotPassword")}
              </Link>
            </div>
            <Button
              className="w-full mt-2 py-3 rounded-md transition-all duration-200 hover:shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              color="primary"
              type="submit"
            >
              {t("login.submitButton")}
            </Button>
          </div>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("login.noAccount")}{" "}
            <Link
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              to="/register"
            >
              {t("login.signUpHere")}
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
