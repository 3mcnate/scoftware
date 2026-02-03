import { formatTimeRemaining } from "@/utils/date-time";
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

type WaitlistNotificationEmailProps = {
  firstName: string;
  tripName: string;
  spotType: "participant" | "driver";
  expiresAt: Date;
  signupUrl: string;
};

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
          <Section style={logoContainer}>
            <Img
              src={`${BASE_URL}/logo.png`}
              width="155"
              height="80"
              alt="SC Outfitters"
              style={logo}
            />
          </Section>

          <Text style={paragraph}>Hi {firstName},</Text>

          <Text style={paragraph}>
            Great news! A <strong>{spotTypeLabel.toLowerCase()} spot</strong> on the trip{" "}
						 <strong>{tripName}</strong> just opened up and you&apos;re first on the waitlist.
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

const logoContainer = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const logo = {
  margin: "0 auto",
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
