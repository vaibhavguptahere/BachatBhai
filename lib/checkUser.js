import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUserId = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("No Clerk user found");
    }

    // Check if the user already exists in Supabase (via Prisma)
    let loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    // If not found → create new user in Supabase
    if (!loggedInUser) {
      const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();

      loggedInUser = await db.user.create({
        data: {
          clerkUserId: user.id,
          name,
          imageUrl: user.imageUrl,
          email: user.emailAddresses[0]?.emailAddress || "",
        },
      });

      console.log("✅ New user created in DB:", loggedInUser.id);
    }

    return loggedInUser;
  } catch (error) {
    console.error("❌ checkUserId error:", error);
    return null;
  }
};
