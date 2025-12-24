"use client";

import { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod/v4";
import { isValidPhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";
import { Save, Loader2, Camera, Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { PhoneInput } from "@/components/ui/phone-input";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/utils/supabase/browser";
import { useProfileById } from "@/data/client/profiles/get-profile-by-id";
import { useUpdateProfile } from "@/data/client/profiles/update-profile";
import { useUnsavedChangesPrompt } from "@/hooks/use-unsaved-changes-prompt";
import { getInitialsFullname } from "@/utils/names";

const ProfileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || isValidPhoneNumber(val), {
      message: "Invalid phone number",
    }),
});

type ProfileFormData = z.infer<typeof ProfileSchema>;

export function SettingsTab() {
  const auth = useAuth();
  const userId = auth.status === "authenticated" ? auth.user.id : "";
  const email = auth.status === "authenticated" ? auth.user.email : "";
  const phone = auth.status === "authenticated" ? '+' + auth.user.phone : "";

	console.log("user", auth.status === "authenticated" ? auth.user : "")

  const { data: profile, isLoading } = useProfileById(userId);
  const { mutateAsync: updateProfile, isPending: isSaving } = useUpdateProfile();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    formState: { isDirty, dirtyFields },
    reset,
  } = useForm<ProfileFormData>({
    resolver: standardSchemaResolver(ProfileSchema),
    values: {
      first_name: profile?.first_name ?? "",
      last_name: profile?.last_name ?? "",
      phone: phone ?? "",
    },
  });


  useUnsavedChangesPrompt(isDirty);

  const onSubmit = async (data: ProfileFormData) => {
    if (!userId) return;

    try {
      const promises: Promise<unknown>[] = [];

      if (dirtyFields.first_name || dirtyFields.last_name) {
        promises.push(
          updateProfile({
            id: userId,
            first_name: data.first_name,
            last_name: data.last_name,
          })
        );
      }

      if (dirtyFields.phone) {
        const supabase = createClient();
        promises.push(
          supabase.auth.updateUser({ phone: data.phone || "" })
        );
      }

      await Promise.all(promises);
      toast.success("Profile updated successfully");
      reset(data);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile"
      );
    }
  };

  if (auth.status !== "authenticated" || isLoading) {
    return <SettingsTabSkeleton />;
  }

  const fullName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : "";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Account Settings
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your profile and account preferences
          </p>
        </div>
        <Button type="submit" disabled={isSaving || !isDirty}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Profile Picture Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Profile Picture</CardTitle>
            <CardDescription>
              Upload a photo to personalize your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile?.avatar ?? undefined} />
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-2xl">
                    {getInitialsFullname(fullName)}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled
                  >
                    Upload New Photo
                  </Button>
                  {profile?.avatar && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive bg-transparent"
                      disabled
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Profile picture upload coming soon
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Details Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Personal Details</CardTitle>
            <CardDescription>
              Update your name and contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="first_name">First Name</FieldLabel>
                  <Controller
                    control={control}
                    name="first_name"
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Input
                          {...field}
                          id="first_name"
                          placeholder="John"
                          disabled={isSaving}
                          aria-invalid={!!error}
                        />
                        <FieldError errors={error ? [error] : undefined} />
                      </>
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="last_name">Last Name</FieldLabel>
                  <Controller
                    control={control}
                    name="last_name"
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Input
                          {...field}
                          id="last_name"
                          placeholder="Doe"
                          disabled={isSaving}
                          aria-invalid={!!error}
                        />
                        <FieldError errors={error ? [error] : undefined} />
                      </>
                    )}
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <PhoneInput
                        {...field}
                        value={field.value ?? ""}
                        defaultCountry="US"
                        disabled={isSaving}
                      />
                      <FieldDescription>
                        Guides will use this number to communicate with you about trips
                      </FieldDescription>
                      <FieldError errors={error ? [error] : undefined} />
                    </>
                  )}
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Email Section (Read-only) */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Email Address</CardTitle>
            <CardDescription>
              Contact us if you need to change your email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                value={email ?? ""}
                disabled
              />
            </Field>
          </CardContent>
        </Card>

        <div>
          <Button type="submit" disabled={isSaving || !isDirty}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export function SettingsTabSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="grid gap-6">
        {/* Profile Picture Card Skeleton */}
        <Card className="bg-card border-border">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-56 mt-1" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-36" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Details Card Skeleton */}
        <Card className="bg-card border-border">
          <CardHeader>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-48 mt-1" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Card Skeleton */}
        <Card className="bg-card border-border">
          <CardHeader>
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-64 mt-1" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-9 w-full" />
            </div>
          </CardContent>
        </Card>

        <Skeleton className="h-9 w-32" />
      </div>
    </div>
  );
}
