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
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded-lg my-[40px] mx-auto p-[32px] w-[465px]">
            <Heading className="text-black text-[24px] font-bold text-center p-0 my-[10px] mx-0">
              Welcome to the Future of Resumes
            </Heading>
            
            <Text className="text-black text-[14px] leading-[24px]">
              Hi {userName},
            </Text>
            
            <Text className="text-black text-[14px] leading-[24px]">
              You're officially on board. We've built an enterprise-grade resume builder engineered to bypass ATS systems and position you perfectly for top-tier roles.
            </Text>

            <Section className="bg-[#f7f7f7] rounded-md p-4 my-6 border border-solid border-[#eaeaea]">
              <Text className="text-black text-[14px] font-semibold leading-[24px] m-0 mb-2">
                Your AI Toolkit is ready:
              </Text>
              <Text className="text-[#666666] text-[13px] leading-[20px] m-0 mb-1">
                • <strong>Magic Summary:</strong> Synthesize years of experience instantly.
              </Text>
              <Text className="text-[#666666] text-[13px] leading-[20px] m-0 mb-1">
                • <strong>Smart Bullets:</strong> Auto-format metrics using the XYZ/STAR method.
              </Text>
              <Text className="text-[#666666] text-[13px] leading-[20px] m-0">
                • <strong>Live ATS Scanner:</strong> Score your resume against target job keywords in real-time.
              </Text>
            </Section>

            {password && (
              <Section className="bg-[#e0f2fe] rounded-md p-4 my-6 border border-solid border-[#bae6fd]">
                <Text className="text-[#0369a1] text-[14px] font-semibold leading-[24px] m-0 mb-2">
                  Your Auto-Generated Login Credentials:
                </Text>
                <Text className="text-[#0369a1] text-[13px] leading-[20px] m-0 mb-1">
                  • <strong>Email:</strong> (this email address)
                </Text>
                <Text className="text-[#0369a1] text-[13px] leading-[20px] m-0 mb-1">
                  • <strong>Password:</strong> {password}
                </Text>
                <Text className="text-[#0369a1] text-[13px] leading-[20px] m-0 mt-3 italic">
                  You can log in using these credentials or simply request a one-time passcode.
                </Text>
              </Section>
            )}
            
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-black rounded-md text-white text-[13px] font-semibold no-underline text-center px-6 py-3"
                href="https://your-resume-app-domain.com/builder"
              >
                Build Your First Resume
              </Button>
            </Section>
            
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              If you have any questions or need help landing that FAANG role, just reply to this email. We're here to help.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
