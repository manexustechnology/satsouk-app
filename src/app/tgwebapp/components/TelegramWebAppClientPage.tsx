'use client';

import { telegramConstants } from "@/constants/telegram";
import { useTelegram } from "@/context/TelegramContext";
import { generateTelegramHash } from "@/lib/telegram";
import { Spinner } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import * as jwt from 'jsonwebtoken';

const TelegramWebAppClientPage: React.FC = () => {
  const { user, unsafeData } = useTelegram();
  const [alreadyLoaded, setAlreadyLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const telegramCheck = async () => {
      setAlreadyLoaded(true);

      // Extract user data
      const userData = {
        authDate: unsafeData.auth_date,
        firstName: user!.first_name,
        lastName: "",
        username: user!.username,
        id: user!.id,
        photoURL: "",
      };


      // Generate the hash for Telegram authentication
      const hash = generateTelegramHash(userData);

      try {
        // Generate an auth token (JWT)
        const telegramAuthToken = jwt.sign(
          {
            ...userData,
            hash,
          },
          telegramConstants.botToken,
          { algorithm: "HS256" }
        );

        // URL-encode the generated JWT for safe usage in a URL
        const encodedTelegramAuthToken = encodeURIComponent(telegramAuthToken);

        router.push(`/?telegramAuthToken=${encodedTelegramAuthToken}`);
      } catch (error) {
        console.log(error);
      }
    }

    if (user && !alreadyLoaded) {
      telegramCheck();
    }
  }, [user, alreadyLoaded]);

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <Spinner size="xl" color="white" />
    </div>
  )
}

export default TelegramWebAppClientPage;