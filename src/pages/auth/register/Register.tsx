import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import { MdPerson, MdBadge, MdEmail, MdLock } from "react-icons/md";

import { useRegister } from "../../../hooks/useAuth";
import { useAuthStatus } from "../../../hooks/useAuthStatus";

import RegisterSideBar from "./RegisterSideBar";

const Register: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Using errors state but not setting it directly - it's used by the Form component
  const [errors] = React.useState({});

  const register = useRegister();
  const { isAuthenticated } = useAuthStatus();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate replace to="/groups" />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate({ username, name, email, password });
  };

  const getPasswordError = (value: string) => {
    if (value.length < 4) {
      return t("register.validation.passwordMin");
    }
    if ((value.match(/[A-Z]/g) || []).length < 1) {
      return t("register.validation.passwordUppercase");
    }
    if ((value.match(/[^a-z]/gi) || []).length < 1) {
      return t("register.validation.passwordSymbol");
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
              {t("register.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {t("register.subtitle")}
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
                  <MdPerson className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                errorMessage={({ validationDetails }) => {
                  if (validationDetails.valueMissing) {
                    return t("register.validation.usernameRequired");
                  }
                }}
                label={t("register.username")}
                labelPlacement="outside"
                name="username"
                placeholder={t("register.placeholders.username")}
                type="text"
                value={username}
                onValueChange={setUsername}
              />
              <Input
                isRequired
                className="rounded-md"
                endContent={
                  <MdBadge className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                errorMessage={({ validationDetails }) => {
                  if (validationDetails.valueMissing) {
                    return t("register.validation.nameRequired");
                  }
                }}
                label={t("register.name")}
                labelPlacement="outside"
                name="name"
                placeholder={t("register.placeholders.name")}
                type="text"
                value={name}
                onValueChange={setName}
              />
              <Input
                isRequired
                className="rounded-md"
                endContent={
                  <MdEmail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                errorMessage={({ validationDetails }) => {
                  if (validationDetails.valueMissing) {
                    return t("register.validation.emailRequired");
                  }
                  if (validationDetails.typeMismatch) {
                    return t("register.validation.emailInvalid");
                  }
                }}
                label={t("register.email")}
                labelPlacement="outside"
                name="email"
                placeholder={t("register.placeholders.email")}
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
                errorMessage={getPasswordError(password)}
                label={t("register.password")}
                labelPlacement="outside"
                name="password"
                placeholder={t("register.placeholders.password")}
                type="password"
                value={password}
                onValueChange={setPassword}
              />

              <Button
                className="w-full mt-2 py-3 rounded-md transition-all duration-200 hover:shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                color="primary"
                type="submit"
              >
                {t("register.submitButton")}
              </Button>
            </div>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("register.alreadyHaveAccount")}{" "}
              <Link
                className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                to="/login"
              >
                {t("register.signInHere")}
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
