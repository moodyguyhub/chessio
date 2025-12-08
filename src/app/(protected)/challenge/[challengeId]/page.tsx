import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { ChallengePlayer } from "@/components/challenges/ChallengePlayer";
import { getChallengeConfig, type CoachChallengeId } from "@/lib/challenges/config";

interface PageProps {
  params: Promise<{ challengeId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { challengeId } = await params;
  
  try {
    const config = getChallengeConfig(challengeId as CoachChallengeId);
    return {
      title: `${config.title} | Chessio`,
    };
  } catch {
    return {
      title: "Challenge | Chessio",
    };
  }
}

export default async function ChallengePage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { challengeId } = await params;

  // Validate challenge ID
  if (challengeId !== "level0_challenge" && challengeId !== "level1_challenge") {
    notFound();
  }

  const config = getChallengeConfig(challengeId as CoachChallengeId);

  return <ChallengePlayer config={config} />;
}

export async function generateStaticParams() {
  return [
    { challengeId: "level0_challenge" },
    { challengeId: "level1_challenge" },
  ];
}
