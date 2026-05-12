import ProfileClient from "@/components/user/ProfileClient";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;

  return <ProfileClient id={id} />;
}