"use client";

import { useTripTickets } from "@/data/client/tickets/get-trip-tickets";
import { getInitials } from "@/utils/names";
import { getAvatarUrl } from "@/data/client/storage/avatars";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";

type TripParticipantsMedicalInfoProps = {
  tripId: string;
};

export const TripAlerts = ({
  tripId,
}: TripParticipantsMedicalInfoProps) => {
  const { data: tickets, isLoading: isTicketsLoading } = useTripTickets(tripId);

  if (isTicketsLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading medical info...
      </div>
    );
  }

  const participantsWithMedicalInfo = tickets?.filter(
    (t) =>
      !t.cancelled &&
      t.user.participant_info &&
      (t.user.participant_info.dietary_restrictions.length > 0 ||
        t.user.participant_info.allergies !== "" ||
        t.user.participant_info.medical_history !== "" ||
        t.user.participant_info.medications !== "")
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex gap-2 items-center">
          <h2 className="text-xl font-semibold">Alerts</h2>
          <Badge variant={"secondary"}>
            {participantsWithMedicalInfo?.length || 0}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Participants that have no dietary restrictions, allergies, medications,
          or medical history aren&apos;t listed
        </p>
      </div>
      <div className="rounded-md border">
        {participantsWithMedicalInfo &&
        participantsWithMedicalInfo.length > 0 ? (
          <ItemGroup>
            {participantsWithMedicalInfo.map((ticket, index) => {
              const user = ticket.user;
              const info = user?.participant_info;
              return (
                <div key={ticket.id}>
                  <Item>
                    <ItemMedia>
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            user?.avatar_path
                              ? getAvatarUrl(user.avatar_path)
                              : undefined
                          }
                          alt={user?.first_name}
                        />
                        <AvatarFallback>
                          {getInitials(user?.first_name, user?.last_name)}
                        </AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent className="gap-2">
                      <ItemTitle>
                        {user?.first_name} {user?.last_name}
                      </ItemTitle>
                      <div className="flex flex-col gap-2">
                        {info?.dietary_restrictions &&
                          info.dietary_restrictions.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap text-muted-foreground">
                              Dietary Restrictions:
                              <div className="flex gap-1 flex-wrap">
                                {info.dietary_restrictions.map(
                                  (restriction) => (
                                    <Badge
                                      key={restriction}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {restriction}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        {info?.allergies && info.allergies !== "" && (
                          <p className="text-sm text-foreground">
                            <span className="text-muted-foreground">
                              Allergies:{" "}
                            </span>
                            {info.allergies}
                          </p>
                        )}
                        {info?.medical_history &&
                          info.medical_history !== "" && (
                            <div className="text-muted-foreground text-sm">
                              Medical History:
                              <span className="text-foreground">
                                {" "}
                                {info.medical_history}
                              </span>
                            </div>
                          )}
                        {info?.medications && info.medications !== "" && (
                          <div className="text-muted-foreground text-sm">
                            Medications:
                            <span className="text-foreground">
                              {" "}
                              {info.medications}
                            </span>
                          </div>
                        )}
                      </div>
                    </ItemContent>
                  </Item>
                  {index !== participantsWithMedicalInfo.length - 1 && (
                    <ItemSeparator />
                  )}
                </div>
              );
            })}
          </ItemGroup>
        ) : (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No participants with medical info.
          </div>
        )}
      </div>
    </div>
  );
};
