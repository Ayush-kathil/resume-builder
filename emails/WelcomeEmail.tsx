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
  Img
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  userName?: string;
  password?: string;
}

const baseUrl = process.env.NEXTAUTH_URL ? process.env.NEXTAUTH_URL : 'https://handhold.io';

export const WelcomeEmail = ({ userName = 'there', password }: WelcomeEmailProps) => {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>Welcome to the Future of Resumes - Upgrade your career trajectory.</Preview>
        <Body className="bg-[#F2F1ED] my-auto mx-auto font-sans text-[#1a1a1a]">
          <Container className="border border-solid border-[#e5e5e5] bg-white rounded-[2rem] my-[40px] mx-auto w-full max-w-[500px] shadow-xl overflow-hidden">
            
            {/* Logo Section */}
            <Section className="px-[30px] pt-[30px] sm:px-[50px] sm:pt-[40px] pb-[20px]">
              <table align="left" border={0} cellPadding={0} cellSpacing={0}>
                <tr>
                  <td style={{ verticalAlign: "middle" }}>
                    <div style={{ display: "inline-block", width: "6px", height: "16px", backgroundColor: "#1a1a1a", borderRadius: "9999px", marginRight: "2px" }} />
                    <div style={{ display: "inline-block", width: "6px", height: "24px", backgroundColor: "#1a1a1a", borderRadius: "9999px", marginRight: "2px", transform: "translateY(-4px)" }} />
                    <div style={{ display: "inline-block", width: "6px", height: "16px", backgroundColor: "#1a1a1a", borderRadius: "9999px", marginRight: "8px" }} />
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <span style={{ fontFamily: "ui-serif, Georgia, serif", fontSize: "20px", fontWeight: 500, letterSpacing: "-0.5px", color: "#1a1a1a" }}>resume maker</span>
                  </td>
                </tr>
              </table>
            </Section>

            {/* Hero Image */}
            <Section className="w-full">
              <Img 
                src="https://raw.githubusercontent.com/Ayush-kathil/resume-builder/main/public/emails/welcome_hero_animated.png" 
                width="100%" 
                height="auto"
                alt="Welcome Hero Graphic" 
                className="w-full object-cover"
              />
            </Section>

            {/* Content Section */}
            <Section className="px-[30px] pb-[30px] sm:px-[50px] sm:pb-[50px] pt-[20px]">
              <Section className="mb-[24px]">
                <Heading className="text-[#1a1a1a] text-[32px] font-medium p-0 m-0 tracking-tight font-serif">
                  Welcome to <span className="font-bold">ResumeAI</span>
                </Heading>
                <Text className="text-gray-500 text-[16px] mt-[8px]">
                  The Future of Resumes is Here.
                </Text>
              </Section>
              
              <Text className="text-[#1a1a1a] text-[16px] leading-[26px]">
                Hi {userName},
              </Text>
              
              <Text className="text-gray-600 text-[15px] leading-[26px]">
                You're officially on board. We've built an enterprise-grade resume builder engineered to bypass ATS systems and position you perfectly for top-tier roles.
              </Text>

              <Section className="bg-[#F2F1ED] rounded-2xl p-[24px] my-[32px] border border-solid border-[#e5e5e5]">
                <Text className="text-[#1a1a1a] text-[15px] font-semibold leading-[24px] m-0 mb-[12px]">
                  Your AI Toolkit is ready:
                </Text>
                <Text className="text-gray-600 text-[14px] leading-[22px] m-0 mb-[8px]">
                  <span className="text-[#1a1a1a] mr-2">✦</span>
                  <strong>Magic Summary:</strong> Synthesize years of experience instantly.
                </Text>
                <Text className="text-gray-600 text-[14px] leading-[22px] m-0 mb-[8px]">
                  <span className="text-[#1a1a1a] mr-2">✦</span>
                  <strong>Smart Bullets:</strong> Auto-format metrics using the XYZ/STAR method.
                </Text>
                <Text className="text-gray-600 text-[14px] leading-[22px] m-0">
                  <span className="text-[#1a1a1a] mr-2">✦</span>
                  <strong>Live ATS Scanner:</strong> Score against target job keywords in real-time.
                </Text>
              </Section>

              {password && (
                <Section className="bg-gray-50 rounded-2xl p-[24px] my-[32px] border border-solid border-gray-200">
                  <Text className="text-[#1a1a1a] text-[15px] font-semibold leading-[24px] m-0 mb-[12px]">
                    Your Auto-Generated Credentials:
                  </Text>
                  <Text className="text-gray-600 text-[14px] leading-[22px] m-0 mb-[8px]">
                    • <strong>Email:</strong> (this email address)
                  </Text>
                  <Text className="text-gray-600 text-[14px] leading-[22px] m-0 mb-[8px]">
                    • <strong>Password:</strong> <code className="bg-white border border-gray-200 px-2 py-1 rounded text-[#1a1a1a] tracking-widest font-mono">{password}</code>
                  </Text>
                  <Text className="text-gray-500 text-[13px] leading-[20px] m-0 mt-[16px]">
                    You can log in using these credentials or simply request a one-time passcode.
                  </Text>
                </Section>
              )}
              
              <Section className="text-center mt-[40px] mb-[40px]">
                <Button
                  className="bg-[#1a1a1a] rounded-xl text-white text-[15px] font-medium no-underline text-center px-8 py-4 w-full shadow-md hover:bg-black transition-colors"
                  href={`${baseUrl}/builder`}
                >
                  Launch Builder
                </Button>
              </Section>
              
              <Hr className="border border-solid border-[#e5e5e5] my-[32px] mx-0 w-full" />
              
              <Text className="text-gray-400 text-[13px] leading-[24px] text-center">
                If you have any questions or need help landing that FAANG role, just reply to this email. We're here to help.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
