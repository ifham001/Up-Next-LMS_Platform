
import { dbDrizzle } from "../../config/pg.db";
import { resource } from "../../schema/admin/resource";
import { eq } from "drizzle-orm";

// Function to get resources by section ID
export const getResourcesBySection = async (resourceId: string) => {
  try {
    const resourcesList = await dbDrizzle
      .select()
      .from(resource)
      .where(eq(resource.id, resourceId));

    if (resourcesList.length === 0) {
      return { success: false, data: [], message: "No resources found" };
    }

    return { success: true, data: resourcesList };
  } catch (error) {
    console.error("Error fetching resources:", error);
    return { success: false, data: [], message: "Internal server error" };
  }
};
