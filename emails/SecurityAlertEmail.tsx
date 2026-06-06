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
