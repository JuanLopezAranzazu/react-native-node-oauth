import React from "react";
import { Avatar, AvatarFallbackText, AvatarImage } from "@gluestack-ui/themed";

export default function UserAvatar({ user, size = "sm" }) {
  return (
    <Avatar size={size}>
      {user?.avatar ? (
        <AvatarImage
          source={{ uri: user.avatar }}
          alt={user.name || "Avatar"}
        />
      ) : (
        <AvatarFallbackText>{user?.name || "Usuario"}</AvatarFallbackText>
      )}
    </Avatar>
  );
}
