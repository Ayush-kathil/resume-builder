import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
} from "@react-email/components";
import * as React from "react";

interface AccountDeletionEmailProps {
  userName: string;
  otp: string;
}

export const AccountDeletionEmail = ({ userName, otp }: AccountDeletionEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Account Deletion Request - Verification Code</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Account Deletion Request</Heading>
          <Text style={text}>Hi {userName},</Text>
          <Text style={text}>
            We received a request to permanently delete your Resume Maker account and all associated data. If you initiated this request, please use the verification code below to confirm:
          </Text>
          <Section style={codeBox}>
            <Text style={codeText}>{otp}</Text>
          </Section>
          <Text style={text}>
            <strong>Warning:</strong> This action cannot be undone. All your resumes and profile data will be permanently erased.
          </Text>
          <Text style={text}>
            If you did not request this, please ignore this email and your account will remain secure. We also recommend changing your password immediately.
          </Text>
          <Text style={footer}>
            — The Resume Maker Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default AccountDeletionEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "5px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
  maxWidth: "600px",
};

const h1 = {
  color: "#d93025",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "40px",
  margin: "0 0 20px",
  padding: "0 48px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  padding: "0 48px",
};

const codeBox = {
  backgroundColor: "#f4f4f4",
  borderRadius: "4px",
  margin: "20px 48px",
  padding: "16px",
  textAlign: "center" as const,
};

const codeText = {
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "6px",
  margin: "0",
  color: "#333",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  padding: "0 48px",
  marginTop: "48px",
};
