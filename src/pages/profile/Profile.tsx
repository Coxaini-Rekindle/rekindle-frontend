import React, { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Input } from "@heroui/input";
import { MdUpload, MdEdit, MdCheck, MdClose } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useUserProfile } from "@/hooks/useUser";

const Profile = () => {
  const { t } = useTranslation();

  // Redux hooks
  const {
    profile,
    profileLoading,
    profileError,
    updateNameLoading,
    uploadAvatarLoading,
    fetchProfile,
    updateName,
    uploadAvatar,
    getAvatarUrl,
  } = useUserProfile();

  // Local state
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(profile?.name || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local name value when profile changes
  useEffect(() => {
    if (profile?.name) {
      setNameValue(profile.name);
    }
  }, [profile?.name]);

  // Show error toast if profile loading fails
  useEffect(() => {
    if (profileError) {
      toast.error(`${t("common.error")}: ${profileError}`);
    }
  }, [profileError, t]);

  const handleNameEditClick = () => {
    setIsEditingName(true);
  };

  const handleNameCancel = () => {
    setNameValue(profile?.name || "");
    setIsEditingName(false);
  };

  const handleNameSave = async () => {
    if (!nameValue.trim()) {
      toast.error(t("profile.nameRequired"));

      return;
    }

    try {
      await updateName(nameValue);
      setIsEditingName(false);
    } catch {
      // Error is handled by the Redux thunk
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error(t("profile.invalidImageType"));

      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t("profile.imageTooLarge"));

      return;
    }

    try {
      await uploadAvatar(file);
    } catch {
      // Error is handled by the Redux thunk
    } finally {
      // Clear the input value to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <Card className="mb-6">
          <CardBody>
            <div className="text-center py-8">
              <p className="text-danger">{t("profile.loadError")}</p>
              <Button
                className="mt-4"
                color="primary"
                onClick={() => fetchProfile()}
              >
                {t("common.retry")}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">{t("profile.title")}</h1>

      <Card className="mb-6">
        <CardHeader className="flex gap-3">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-xl font-semibold">
              {t("profile.profileInfo")}
            </h2>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <div
                className="relative cursor-pointer group"
                role="button"
                tabIndex={0}
                onClick={handleAvatarClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleAvatarClick();
                  }
                }}
              >
                <Avatar
                  showFallback
                  className="w-32 h-32 text-large"
                  name={profile?.name}
                  src={
                    profile?.avatarFileId
                      ? getAvatarUrl(profile.avatarFileId)
                      : undefined
                  }
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <MdUpload className="text-white text-2xl" />
                </div>
              </div>
              <input
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                type="file"
                onChange={handleAvatarChange}
              />
              <Button
                color="primary"
                disabled={uploadAvatarLoading}
                isLoading={uploadAvatarLoading}
                size="sm"
                startContent={<MdUpload />}
                variant="flat"
                onClick={handleAvatarClick}
              >
                {t("profile.changeAvatar")}
              </Button>
            </div>

            {/* User Info Section */}
            <div className="flex-1 w-full">
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-foreground-600 mb-1">
                    {t("profile.name")}
                  </label>
                  <div className="flex items-center gap-2">
                    {isEditingName ? (
                      <>
                        <Input
                          classNames={{
                            inputWrapper: "!bg-default-100",
                          }}
                          disabled={updateNameLoading}
                          placeholder={t("profile.enterName")}
                          value={nameValue}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setNameValue(e.target.value)
                          }
                          onKeyDown={(
                            e: React.KeyboardEvent<HTMLInputElement>,
                          ) => {
                            if (e.key === "Enter") handleNameSave();
                            if (e.key === "Escape") handleNameCancel();
                          }}
                        />
                        <Button
                          isIconOnly
                          color="success"
                          disabled={updateNameLoading}
                          isLoading={updateNameLoading}
                          variant="flat"
                          onClick={handleNameSave}
                        >
                          <MdCheck />
                        </Button>
                        <Button
                          isIconOnly
                          disabled={updateNameLoading}
                          variant="flat"
                          onClick={handleNameCancel}
                        >
                          <MdClose />
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="text-foreground py-2">
                          {profile?.name}
                        </div>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onClick={handleNameEditClick}
                        >
                          <MdEdit />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Username Field - Read Only */}
                <div>
                  <label className="block text-sm font-medium text-foreground-600 mb-1">
                    {t("profile.username")}
                  </label>
                  <div className="text-foreground py-2">
                    {profile?.username}
                  </div>
                </div>

                {/* Email Field - Read Only */}
                <div>
                  <label className="block text-sm font-medium text-foreground-600 mb-1">
                    {t("profile.email")}
                  </label>
                  <div className="text-foreground py-2">{profile?.email}</div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
        <CardFooter className="flex justify-end" />
      </Card>
    </div>
  );
};

export default Profile;
