import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type WaitlistNotificationEmailProps = {
  firstName: string;
  tripName: string;
  spotType: "participant" | "driver";
  expiresAt: Date;
  signupUrl: string;
};

function formatTimeRemaining(expiresAt: Date): string {
  const now = new Date();
  const diffMs = expiresAt.getTime() - now.getTime();

  if (diffMs <= 0) return "expired";

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays >= 1) {
    const remainingHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (remainingHours > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} and ${remainingHours} hour${remainingHours > 1 ? "s" : ""}`;
    }
    return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
  }

  if (diffHours >= 1) {
    const remainingMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (remainingMinutes > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} and ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`;
    }
    return `${diffHours} hour${diffHours > 1 ? "s" : ""}`;
  }

  return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function WaitlistNotificationEmail({
  firstName,
  tripName,
  spotType,
  expiresAt,
  signupUrl,
}: WaitlistNotificationEmailProps) {
  const timeRemaining = formatTimeRemaining(expiresAt);
  const expirationFormatted = formatDate(expiresAt);
  const spotTypeLabel = spotType === "driver" ? "Driver" : "Participant";

  return (
    <Html>
      <Head />
      <Preview>A spot opened up for {tripName}!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>A Spot Opened Up!</Heading>

          <Text style={paragraph}>Hi {firstName},</Text>

          <Text style={paragraph}>
            Great news! A <strong>{spotTypeLabel.toLowerCase()} spot</strong> has
            opened up for <strong>{tripName}</strong>.
          </Text>

          <Section style={highlightBox}>
            <Text style={highlightText}>
              <strong>Spot Type:</strong> {spotTypeLabel}
            </Text>
            <Text style={highlightText}>
              <strong>Time Remaining:</strong> {timeRemaining}
            </Text>
            <Text style={highlightText}>
              <strong>Expires At:</strong> {expirationFormatted}
            </Text>
          </Section>

          <Text style={paragraph}>
            Click the button below to complete your signup before it expires.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={signupUrl}>
              SIGN ME UP BIG TIME!
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            If you no longer wish to join this trip, you can ignore this email
            and your spot will be released to the next person on the waitlist.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
  borderRadius: "8px",
};

const heading = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600" as const,
  lineHeight: "1.3",
  margin: "0 0 24px",
  textAlign: "center" as const,
};

const paragraph = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const highlightBox = {
  backgroundColor: "#f4f7fa",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const highlightText = {
  color: "#1a1a1a",
  fontSize: "14px",
  lineHeight: "1.8",
  margin: "0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#18181b",
  borderRadius: "6px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "600" as const,
  lineHeight: "1",
  padding: "14px 28px",
  textDecoration: "none",
  textAlign: "center" as const,
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "32px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0",
};

export default WaitlistNotificationEmail;
