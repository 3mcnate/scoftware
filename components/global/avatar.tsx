"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfileById } from "@/data/client/profiles/get-profile-by-id";
import { getAvatarUrl } from "@/data/client/storage/avatars";

export default function AppAvatar({ userId }: { userId: string }) {
  const { data: profile } = useProfileById(userId);
  const imageSource = getAvatarUrl(profile?.avatar_path ?? "");

  return (
    <Avatar>
      <AvatarImage src={imageSource} />
      <AvatarFallback></AvatarFallback>
    </Avatar>
  );
}
