import { redactPII, detectJailbreak } from './security';
import { User } from '@/models/User';
import { AILog } from '@/models/AILog';
import mongoose from 'mongoose';

export interface AIGatewayRequest {
  userId: string;
  promptContent: string;
  endpoint?: string;
  promptName?: string;
  promptVersion?: number;
}

export interface AIGatewayResponse {
  text: string;
  error?: string;
  flagged?: boolean;
}

// Simple mock for token counting (approx 4 chars per token)
const estimateTokens = (text: string) => Math.ceil(text.length / 4);

export const generateAIContent = async (req: AIGatewayRequest): Promise<AIGatewayResponse> => {
  const startTime = Date.now();
  
  // 1. Fetch User and Check Budget
  const user = await User.findById(req.userId);
  if (!user) {
    return { text: '', error: 'User not found' };
  }

  // Anti-Abuse: Rate Limiting (Max 5 requests per minute)
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  const recentRequestsCount = await AILog.countDocuments({
    userId: user._id,
    createdAt: { $gte: oneMinuteAgo }
  });
  if (recentRequestsCount >= 5) {
    return { text: '', error: 'Rate limit exceeded. Try again in a minute.', flagged: true };
  }

  if (user.tokenBalance >= user.monthlyLimit) {
    return { text: '', error: 'Monthly token limit exceeded. Please upgrade your tier.' };
  }

  // 2. Security Check (Jailbreak & Plagiarism)
  const isJailbreak = detectJailbreak(req.promptContent);
  // Anti-Abuse: Duplicate Content Detection (Spam Profile Prevention)
  const duplicateRequest = await AILog.findOne({
    userId: user._id,
    promptName: req.promptName,
    inputTokens: estimateTokens(req.promptContent),
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // within 24 hrs
  });

  if (isJailbreak || duplicateRequest) {
    // Log the flagged request
    await AILog.create({
      userId: new mongoose.Types.ObjectId(req.userId),
      endpoint: req.endpoint || 'unknown',
      promptName: req.promptName,
      promptVersion: req.promptVersion,
      inputTokens: estimateTokens(req.promptContent),
      outputTokens: 0,
      totalTokens: estimateTokens(req.promptContent),
      jailbreakFlagged: isJailbreak,
      piiRedacted: false,
      confidenceScore: 0,
      needsReview: true,
      latencyMs: Date.now() - startTime,
    });
    return { 
      text: '', 
      error: isJailbreak ? 'Request flagged for policy violation.' : 'Duplicate content detected (spam protection).', 
      flagged: true 
    };
  }

  // 3. Security Check (PII Redaction)
  const { redactedText, hasPII } = redactPII(req.promptContent);

  // 4. MOCK LLM CALL (In a real app, call OpenAI here)
  const inputTokens = estimateTokens(redactedText);
  // Simulating output text
  const outputText = `This is a generated response based on: ${redactedText.substring(0, 50)}...`;
  const outputTokens = estimateTokens(outputText);
  const totalTokens = inputTokens + outputTokens;

  // Mock Confidence Score (85 to 100, occasionally dropping to force human review)
  // If the prompt is very short or weird, we give it a lower score.
  let confidenceScore = Math.floor(Math.random() * 15) + 85; 
  if (req.promptContent.length < 20) {
    confidenceScore = Math.floor(Math.random() * 20) + 50; // Low confidence
  }
  const needsReview = confidenceScore < 75;

  // 5. Update User Token Balance
  user.tokenBalance += totalTokens;
  await user.save();

  // 6. Log the request
  await AILog.create({
    userId: new mongoose.Types.ObjectId(req.userId),
    endpoint: req.endpoint || 'unknown',
    promptName: req.promptName,
    promptVersion: req.promptVersion,
    inputTokens,
    outputTokens,
    totalTokens,
    costEstimateUSD: totalTokens * 0.000002, // Mock cost
    jailbreakFlagged: false,
    piiRedacted: hasPII,
    confidenceScore,
    needsReview,
    latencyMs: Date.now() - startTime,
  });

  return { text: outputText };
};
