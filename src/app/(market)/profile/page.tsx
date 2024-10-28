import { Suspense } from "react";
import ProfileClientPage from "../components/profile/ProfileClientPage";

export default function ProfilePage() {
  return (
    <>
      <Suspense>
        <ProfileClientPage />
      </Suspense>
    </>
  );
}
