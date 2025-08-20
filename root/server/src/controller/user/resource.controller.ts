import { Context } from "hono";
import { getResourcesBySection } from "../../queries/user/resource.queries";

export const resourceController =async (c: Context) => {
  // Get resources by section ID
 
    try {
      // Get sectionId from route params
      const { resourceId } = c.req.param();
      if (!resourceId) {
        return c.json({ success: false, message: "sectionId is required" }, 400);
      }

      const resources = await getResourcesBySection(resourceId);

      if (!resources.success) {
        return c.json({ success: false, message: resources.message }, 404);
      }

      return c.json({ success: true, data: resources.data }, 200);
    } catch (error) {
      console.error("Resource controller error:", error);
      return c.json({ success: false, message: "Internal server error" }, 500);
    }
  
};
