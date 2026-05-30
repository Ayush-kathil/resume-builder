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
        <Body className="bg-[#09090b] my-auto mx-auto font-sans text-[#ededed]">
          <Container className="border border-solid border-[#27272a] bg-[#18181b] rounded-xl my-[40px] mx-auto p-[40px] w-[500px] shadow-2xl">
            <Section className="text-center mb-[32px]">
              <Heading className="text-white text-[28px] font-extrabold text-center p-0 m-0 tracking-tight">
                Welcome to <span className="text-[#3b82f6]">ResumeAI</span>
              </Heading>
              <Text className="text-[#a1a1aa] text-[16px] mt-[8px]">
                The Future of Resumes is Here.
              </Text>
            </Section>
            
            <Text className="text-[#ededed] text-[16px] leading-[26px]">
              Hi {userName},
            </Text>
            
            <Text className="text-[#a1a1aa] text-[15px] leading-[26px]">
              You're officially on board. We've built an enterprise-grade resume builder engineered to bypass ATS systems and position you perfectly for top-tier roles.
            </Text>

            <Section className="bg-[#27272a] rounded-xl p-[24px] my-[32px] border border-solid border-[#3f3f46]">
              <Text className="text-white text-[15px] font-semibold leading-[24px] m-0 mb-[12px]">
                Your AI Toolkit is ready:
              </Text>
              <Text className="text-[#d4d4d8] text-[14px] leading-[22px] m-0 mb-[8px]">
                <span className="text-[#3b82f6] mr-2">✦</span>
                <strong>Magic Summary:</strong> Synthesize years of experience instantly.
              </Text>
              <Text className="text-[#d4d4d8] text-[14px] leading-[22px] m-0 mb-[8px]">
                <span className="text-[#3b82f6] mr-2">✦</span>
                <strong>Smart Bullets:</strong> Auto-format metrics using the XYZ/STAR method.
              </Text>
              <Text className="text-[#d4d4d8] text-[14px] leading-[22px] m-0">
                <span className="text-[#3b82f6] mr-2">✦</span>
                <strong>Live ATS Scanner:</strong> Score against target job keywords in real-time.
              </Text>
            </Section>

            {password && (
              <Section className="bg-[#1e1b4b] rounded-xl p-[24px] my-[32px] border border-solid border-[#3730a3]">
                <Text className="text-[#818cf8] text-[15px] font-semibold leading-[24px] m-0 mb-[12px]">
                  Your Auto-Generated Credentials:
                </Text>
                <Text className="text-[#c7d2fe] text-[14px] leading-[22px] m-0 mb-[8px]">
                  • <strong>Email:</strong> (this email address)
                </Text>
                <Text className="text-[#c7d2fe] text-[14px] leading-[22px] m-0 mb-[8px]">
                  • <strong>Password:</strong> <code className="bg-[#312e81] px-2 py-1 rounded text-white tracking-widest">{password}</code>
                </Text>
                <Text className="text-[#818cf8] text-[13px] leading-[20px] m-0 mt-[16px] opacity-80">
                  You can log in using these credentials or simply request a one-time passcode.
                </Text>
              </Section>
            )}
            
            <Section className="text-center mt-[40px] mb-[40px]">
              <Button
                className="bg-[#3b82f6] rounded-lg text-white text-[15px] font-bold no-underline text-center px-8 py-4 w-full shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                href="https://your-resume-app-domain.com/builder"
              >
                Launch Builder
              </Button>
            </Section>
            
            <Hr className="border border-solid border-[#3f3f46] my-[32px] mx-0 w-full" />
            
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
