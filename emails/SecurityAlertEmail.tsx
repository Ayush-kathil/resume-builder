import {
  Body,
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

interface SecurityAlertEmailProps {
  userName: string;
  action: string;
  time: string;
}

const baseUrl = process.env.NEXTAUTH_URL ? process.env.NEXTAUTH_URL : 'https://handhold.io';

export const SecurityAlertEmail = ({ userName, action, time }: SecurityAlertEmailProps) => {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>Security Alert: Your account was recently updated</Preview>
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
                src={`${baseUrl}/emails/security_hero.png`} 
                width="100%" 
                height="auto"
                alt="Security Alert Graphic" 
                className="w-full object-cover"
              />
            </Section>

            {/* Content Section */}
            <Section className="px-[30px] pb-[30px] sm:px-[50px] sm:pb-[50px] pt-[20px]">
              <Section className="mb-[24px]">
                <Heading className="text-[#1a1a1a] text-[32px] font-medium p-0 m-0 tracking-tight font-serif">
                  Security Alert
                </Heading>
              </Section>
              
              <Text className="text-[#1a1a1a] text-[16px] leading-[26px]">
                Hi {userName},
              </Text>
              
              <Text className="text-gray-600 text-[15px] leading-[26px]">
                We noticed a recent change to your ResumeAI account. The following action was taken:
              </Text>

              <Section className="bg-[#F2F1ED] rounded-2xl p-[24px] my-[32px] border border-solid border-[#e5e5e5]">
                <Text className="text-gray-600 text-[14px] leading-[22px] m-0 mb-[8px]">
                  <strong>Action:</strong> {action}
                </Text>
                <Text className="text-gray-600 text-[14px] leading-[22px] m-0">
                  <strong>Time:</strong> {time}
                </Text>
              </Section>

              <Text className="text-gray-600 text-[15px] leading-[26px]">
                If this was you, you can safely ignore this email.
              </Text>

              <Text className="text-red-600 font-medium text-[15px] leading-[26px] mt-4">
                If you did not authorize this action, please reset your password immediately and contact support.
              </Text>
              
              <Hr className="border border-solid border-[#e5e5e5] my-[32px] mx-0 w-full" />
              
              <Text className="text-gray-400 text-[13px] leading-[24px] text-center">
                — The ResumeAI Team
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default SecurityAlertEmail;
