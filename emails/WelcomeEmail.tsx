import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  userName?: string;
  password?: string;
}

export const WelcomeEmail = ({ userName = 'there', password }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to the Future of Resumes - Upgrade your career trajectory.</Preview>
      <Tailwind>
        <Body className="bg-[#f9f9f9] my-auto mx-auto font-sans text-[#1a1a1a]">
          <Container className="border border-solid border-[#e5e5e5] bg-white rounded-2xl my-[40px] mx-auto p-[40px] w-[500px] shadow-lg">
            <Section className="text-center mb-[32px]">
              <Heading className="text-[#1a1a1a] text-[28px] font-extrabold text-center p-0 m-0 tracking-tight">
                Welcome to <span className="text-[#3b82f6]">ResumeAI</span>
              </Heading>
              <Text className="text-[#52525b] text-[16px] mt-[8px]">
                The Future of Resumes is Here.
              </Text>
            </Section>
            
            <Text className="text-[#1a1a1a] text-[16px] leading-[26px]">
              Hi {userName},
            </Text>
            
            <Text className="text-[#52525b] text-[15px] leading-[26px]">
              You're officially on board. We've built an enterprise-grade resume builder engineered to bypass ATS systems and position you perfectly for top-tier roles.
            </Text>

            <Section className="bg-[#f4f4f5] rounded-xl p-[24px] my-[32px] border border-solid border-[#e4e4e7]">
              <Text className="text-[#1a1a1a] text-[15px] font-semibold leading-[24px] m-0 mb-[12px]">
                Your AI Toolkit is ready:
              </Text>
              <Text className="text-[#3f3f46] text-[14px] leading-[22px] m-0 mb-[8px]">
                <span className="text-[#3b82f6] mr-2">✦</span>
                <strong>Magic Summary:</strong> Synthesize years of experience instantly.
              </Text>
              <Text className="text-[#3f3f46] text-[14px] leading-[22px] m-0 mb-[8px]">
                <span className="text-[#3b82f6] mr-2">✦</span>
                <strong>Smart Bullets:</strong> Auto-format metrics using the XYZ/STAR method.
              </Text>
              <Text className="text-[#3f3f46] text-[14px] leading-[22px] m-0">
                <span className="text-[#3b82f6] mr-2">✦</span>
                <strong>Live ATS Scanner:</strong> Score against target job keywords in real-time.
              </Text>
            </Section>

            {password && (
              <Section className="bg-[#eff6ff] rounded-xl p-[24px] my-[32px] border border-solid border-[#bfdbfe]">
                <Text className="text-[#1d4ed8] text-[15px] font-semibold leading-[24px] m-0 mb-[12px]">
                  Your Auto-Generated Credentials:
                </Text>
                <Text className="text-[#1e3a8a] text-[14px] leading-[22px] m-0 mb-[8px]">
                  • <strong>Email:</strong> (this email address)
                </Text>
                <Text className="text-[#1e3a8a] text-[14px] leading-[22px] m-0 mb-[8px]">
                  • <strong>Password:</strong> <code className="bg-[#dbeafe] px-2 py-1 rounded text-[#1e40af] tracking-widest">{password}</code>
                </Text>
                <Text className="text-[#2563eb] text-[13px] leading-[20px] m-0 mt-[16px] opacity-80">
                  You can log in using these credentials or simply request a one-time passcode.
                </Text>
              </Section>
            )}
            
            <Section className="text-center mt-[40px] mb-[40px]">
              <Button
                className="bg-[#1a1a1a] rounded-xl text-white text-[15px] font-bold no-underline text-center px-8 py-4 w-full shadow-md"
                href="https://handhold.io/builder"
              >
                Launch Builder
              </Button>
            </Section>
            
            <Hr className="border border-solid border-[#e5e5e5] my-[32px] mx-0 w-full" />
            
            <Text className="text-[#71717a] text-[13px] leading-[24px] text-center">
              If you have any questions or need help landing that FAANG role, just reply to this email. We're here to help.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
