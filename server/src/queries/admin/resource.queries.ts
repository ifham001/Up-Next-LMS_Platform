import { dbDrizzle } from "../../config/pg.db";
import { sectionItem } from "../../schema/admin/section";
import { resource, IResource } from "../../schema/admin/resource";
import { sql ,eq } from "drizzle-orm";



export const createResource = async (res: IResource) => {
   
    try {
      return await dbDrizzle.transaction(async (tx) => {
        const addedResource = await tx.insert(resource).values({
          section_id: res.section_id,
          title: res.title,
          description: res.description,
          resource_url: res.resource_url
        }).returning();
  
        if (!addedResource.length) throw new Error("Resource insert failed");
  
        const sectionId = res.section_id;
  
        const currentMaxOrderResult = await tx
          .select({ maxOrder: sql<number>`MAX("order")` })
          .from(sectionItem)
          .where(eq(sectionItem.section_id,sectionId));
  
        const currentMaxOrder = currentMaxOrderResult[0]?.maxOrder ?? 0;
  
        await tx.insert(sectionItem).values({
          section_id: sectionId,
          item_id: addedResource[0].id,
          content_type: 'resource',
          order: currentMaxOrder + 1,
          title: addedResource[0].title,
        });
  
        return addedResource[0].id;
      });
    } catch (err) {
        throw err;
    }
  };
  