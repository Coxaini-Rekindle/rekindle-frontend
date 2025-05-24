import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Chip } from "@heroui/chip";
import { useTranslation } from "react-i18next";
import {
  MdGroup,
  MdPeople,
  MdCalendarToday,
  MdCheckCircle,
  MdError,
} from "react-icons/md";

import {
  useGroupByInviteId,
  useGroupByJoinToken,
  useAcceptInvitation,
  useJoinGroupWithToken,
} from "@/hooks/useGroups";
import { useAuthStatus } from "@/hooks/useAuthStatus";

type InviteType = "invite" | "token";

export default function GroupInviteAccept() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { inviteId, token } = useParams();
  const { isAuthenticated } = useAuthStatus();
  const [inviteType, setInviteType] = useState<InviteType>("invite");

  // Determine invite type based on route params
  useEffect(() => {
    if (token) {
      setInviteType("token");
    } else if (inviteId) {
      setInviteType("invite");
    }
  }, [inviteId, token]);

  // Clear any stored redirect path when user is authenticated and on invitation page
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.removeItem("redirectAfterAuth");
    }
  }, [isAuthenticated]);

  // Fetch group data based on invite type (only if authenticated)
  const {
    data: groupByInvite,
    isLoading: isLoadingInvite,
    error: errorInvite,
  } = useGroupByInviteId(
    inviteId || "",
    isAuthenticated && inviteType === "invite" && !!inviteId,
  );

  const {
    data: groupByToken,
    isLoading: isLoadingToken,
    error: errorToken,
  } = useGroupByJoinToken(
    token || "",
    isAuthenticated && inviteType === "token" && !!token,
  );

  // Mutations for accepting invitations
  const acceptInviteMutation = useAcceptInvitation();
  const joinGroupMutation = useJoinGroupWithToken();

  const group = inviteType === "invite" ? groupByInvite : groupByToken;
  const isLoading = inviteType === "invite" ? isLoadingInvite : isLoadingToken;
  const error = inviteType === "invite" ? errorInvite : errorToken;

  const handleAcceptInvitation = async () => {
    if (!group) return;

    try {
      if (inviteType === "invite" && inviteId) {
        await acceptInviteMutation.mutateAsync(inviteId);
      } else if (inviteType === "token" && token) {
        await joinGroupMutation.mutateAsync(token);
      }
      navigate("/groups");
    } catch {
      // Error handling is done in the mutation hooks
    }
  };

  const handleDecline = () => {
    navigate("/groups");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardBody className="text-center py-8">
            <MdGroup className="text-4xl text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {t("groupInvite.title")}
            </h2>
            <p className="text-foreground-600 mb-6">
              {t("groupInvite.authRequired")}
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                color="primary"
                onPress={() => {
                  const currentPath = inviteId
                    ? `/groups/invites/${inviteId}`
                    : `/groups/join/${token}`;

                  localStorage.setItem("redirectAfterAuth", currentPath);
                  navigate("/login");
                }}
              >
                {t("groupInvite.actions.login")}
              </Button>
              <Button
                variant="bordered"
                onPress={() => {
                  const currentPath = inviteId
                    ? `/groups/invites/${inviteId}`
                    : `/groups/join/${token}`;

                  localStorage.setItem("redirectAfterAuth", currentPath);
                  navigate("/register");
                }}
              >
                {t("groupInvite.actions.register")}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-foreground-600">{t("groupInvite.loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardBody className="text-center py-8">
            <MdError className="text-4xl text-danger mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-danger">
              {t("groupInvite.error")}
            </h2>
            <p className="text-foreground-600 mb-6">
              {t("groupInvite.invalidInvite")}
            </p>
            <Button color="primary" onPress={() => navigate("/groups")}>
              {t("groupInvite.actions.backToGroups")}
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Check if user is already a member
  if (group.isCurrentUserMember) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardBody className="text-center py-8">
            <MdCheckCircle className="text-4xl text-success mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-success">
              {t("groupInvite.alreadyMember")}
            </h2>
            <p className="text-foreground-600 mb-6">
              You are already a member of &quot;{group.name}&quot;
            </p>
            <div className="flex gap-2 justify-center">
              <Button color="primary" onPress={() => navigate("/groups")}>
                {t("groupInvite.actions.goToGroup")}
              </Button>
              <Button variant="bordered" onPress={() => navigate("/groups")}>
                {t("groupInvite.actions.backToGroups")}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
      <Card className="max-w-lg w-full">
        <CardHeader className="pb-4">
          <div className="flex flex-col w-full">
            <h1 className="text-2xl font-bold text-center">
              {t("groupInvite.title")}
            </h1>
            <p className="text-center text-foreground-600 mt-2">
              {t("groupInvite.groupInfo.title")}
            </p>
          </div>
        </CardHeader>

        <CardBody className="pt-0">
          <div className="space-y-6">
            {/* Group Info */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <MdGroup className="text-3xl text-primary mr-2" />
                <h2 className="text-xl font-semibold">{group.name}</h2>
              </div>

              {group.description && (
                <p className="text-foreground-600 mb-4">{group.description}</p>
              )}

              <div className="flex flex-wrap justify-center gap-2">
                <Chip
                  color="primary"
                  startContent={<MdPeople className="text-sm" />}
                  variant="flat"
                >
                  {t("groupInvite.groupInfo.memberCount", {
                    count: group.memberCount,
                  })}
                </Chip>

                <Chip
                  color="secondary"
                  startContent={<MdCalendarToday className="text-sm" />}
                  variant="flat"
                >
                  {t("groupInvite.groupInfo.createdAt", {
                    date: formatDate(group.createdAt),
                  })}
                </Chip>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                className="flex-1"
                color="primary"
                isLoading={
                  acceptInviteMutation.isPending || joinGroupMutation.isPending
                }
                size="lg"
                onPress={handleAcceptInvitation}
              >
                {t("groupInvite.actions.accept")}
              </Button>

              <Button
                className="flex-1"
                isDisabled={
                  acceptInviteMutation.isPending || joinGroupMutation.isPending
                }
                size="lg"
                variant="bordered"
                onPress={handleDecline}
              >
                {t("groupInvite.actions.decline")}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
