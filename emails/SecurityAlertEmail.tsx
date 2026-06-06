import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Tailwind,
  Hr,
  Button
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
      <Tailwind>
        <Head />
        <Preview>Security Alert: Your account was recently updated</Preview>
        <Body className="bg-[#F2F1ED] my-auto mx-auto font-sans text-[#1a1a1a]">
          <Container className="border border-solid border-[#e5e5e5] bg-white rounded-[2rem] my-[40px] mx-auto p-[30px] sm:p-[50px] w-full max-w-[500px] shadow-xl">
            <Section className="text-center mb-[32px]">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
              <Heading className="text-[#1a1a1a] text-[24px] font-medium text-center p-0 m-0 tracking-tight font-serif">
                Security Alert
              </Heading>
            </Section>
            
            <Text className="text-[#1a1a1a] text-[16px] leading-[26px]">
              Hi {userName},
            </Text>
            
            <Text className="text-gray-600 text-[15px] leading-[26px]">
              We're letting you know that the following action was taken on your account:
            </Text>

            <Section className="bg-red-50 rounded-2xl p-[24px] my-[32px] border border-solid border-red-100">
              <Text className="text-red-800 text-[14px] leading-[22px] m-0 mb-[8px]">
                <strong>Action Performed:</strong><br/>
                <span className="text-red-900 font-medium">{action}</span>
              </Text>
              <Text className="text-red-800 text-[14px] leading-[22px] m-0">
                <strong>Timestamp:</strong><br/>
                <span className="text-red-900 font-mono text-xs">{time}</span>
              </Text>
            </Section>
            
            <Text className="text-gray-600 text-[15px] leading-[26px]">
              If you made this change, you don't need to do anything. If you didn't make this change, please secure your account immediately.
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#1a1a1a] rounded-xl text-white text-[14px] font-medium no-underline text-center px-6 py-3 shadow-md hover:bg-black transition-colors"
                href="https://handhold.io/forgot-password"
              >
                Secure My Account
              </Button>
            </Section>
            
            <Hr className="border border-solid border-[#e5e5e5] my-[32px] mx-0 w-full" />
            
            <Text className="text-gray-400 text-[13px] leading-[24px] text-center">
              — The ResumeAI Security Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default SecurityAlertEmail;
