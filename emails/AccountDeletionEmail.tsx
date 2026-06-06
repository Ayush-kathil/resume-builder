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

interface AccountDeletionEmailProps {
  userName: string;
  otp: string;
}

const baseUrl = process.env.NEXTAUTH_URL ? process.env.NEXTAUTH_URL : 'https://handhold.io';

export const AccountDeletionEmail = ({ userName, otp }: AccountDeletionEmailProps) => {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>Account Deletion Request - Verification Code</Preview>
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
                src={`${baseUrl}/emails/deletion_hero.png`} 
                width="100%" 
                height="auto"
                alt="Account Deletion Graphic" 
                className="w-full object-cover"
              />
            </Section>

            {/* Content Section */}
            <Section className="px-[30px] pb-[30px] sm:px-[50px] sm:pb-[50px] pt-[20px]">
              <Section className="mb-[24px]">
                <Heading className="text-[#1a1a1a] text-[32px] font-medium p-0 m-0 tracking-tight font-serif">
                  Account Deletion Request
                </Heading>
              </Section>
              
              <Text className="text-[#1a1a1a] text-[16px] leading-[26px]">
                Hi {userName},
              </Text>
              
              <Text className="text-gray-600 text-[15px] leading-[26px]">
                We received a request to permanently delete your ResumeAI account and all associated data. If you initiated this request, please use the verification code below to confirm:
              </Text>

              <Section className="bg-gray-50 rounded-2xl p-[24px] my-[32px] border border-solid border-gray-200 text-center">
                <Text className="text-[32px] font-bold tracking-[8px] m-0 text-[#1a1a1a] font-mono">
                  {otp}
                </Text>
              </Section>
              
              <Text className="text-red-600 text-[14px] leading-[22px] font-medium">
                Warning: This action cannot be undone. All your resumes and profile data will be permanently erased.
              </Text>

              <Text className="text-gray-500 text-[13px] leading-[22px] mt-4">
                If you did not request this, please ignore this email and your account will remain secure. We also recommend changing your password immediately.
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

export default AccountDeletionEmail;
