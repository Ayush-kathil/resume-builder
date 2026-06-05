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

interface SecurityAlertEmailProps {
  userName: string;
  action: string;
  time: string;
}

export const SecurityAlertEmail = ({ userName, action, time }: SecurityAlertEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Security Alert: Your account was recently updated</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Security Alert</Heading>
          <Text style={text}>Hi {userName},</Text>
          <Text style={text}>
            We're letting you know that the following action was taken on your account:
          </Text>
          <Section style={alertBox}>
            <Text style={alertText}><strong>Action:</strong> {action}</Text>
            <Text style={alertText}><strong>Time:</strong> {time}</Text>
          </Section>
          <Text style={text}>
            If you made this change, you don't need to do anything. If you didn't make this change, please reset your password immediately and contact support.
          </Text>
          <Text style={footer}>
            — The Resume Maker Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default SecurityAlertEmail;

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
  color: "#333",
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

const alertBox = {
  backgroundColor: "#fff4f4",
  borderLeft: "4px solid #d93025",
  margin: "20px 48px",
  padding: "16px",
  borderRadius: "4px",
};

const alertText = {
  margin: "4px 0",
  fontSize: "16px",
  color: "#333",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  padding: "0 48px",
  marginTop: "48px",
};
