export interface UserData {
  id: string;
  walletAddress: string;
  twitterId: string;
  inviteCode: string;
  referralCode: string;
  referralCodeLimit: number;
  point: BigInt;
  onboardingStep: BigInt;
  finishOnboarding: boolean;
  createdAt: Date;
  updatedAt: number;
}

export interface AuthApplyInviteCodeRequest {
  inviteCode: string;
}

export interface AuthUserOnBoardingStepRequest {
  walletAddress: string;
  step: number;
}

export interface AuthUserOnBoardingStepResponse {
  onBoardingStep: BigInt;
}
