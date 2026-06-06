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
      <Tailwind>
        <Body className="bg-[#F2F1ED] my-auto mx-auto font-sans text-[#1a1a1a]">
          <Container className="border border-solid border-[#e5e5e5] bg-white rounded-[2rem] my-[40px] mx-auto p-[30px] sm:p-[50px] w-full max-w-[500px] shadow-xl">
            <Section className="text-center mb-[32px]">
              <Heading className="text-[#1a1a1a] text-[24px] font-medium text-center p-0 m-0 tracking-tight font-serif">
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
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AccountDeletionEmail;
