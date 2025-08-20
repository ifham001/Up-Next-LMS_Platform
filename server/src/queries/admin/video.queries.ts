import { eq, sql } from "drizzle-orm";
import { dbDrizzle } from "../../config/pg.db";
import { sectionItem } from "../../schema/admin/section";
import { IVideo, video } from "../../schema/admin/video";



export const addVideo = async (newVideo: IVideo) => {
    return await dbDrizzle.transaction(async (tx) => {
      const addedVideo = await tx.insert(video).values(newVideo).returning();
     
      const sectionId = newVideo.section_id;
      const currentMaxOrderResult = await tx
        .select({ maxOrder: sql<number>`MAX(${sectionItem.order})` })
        .from(sectionItem)
        .where(eq(sectionItem.section_id, sectionId));
  
      const currentMaxOrder = currentMaxOrderResult[0].maxOrder ?? 0;
  
       await tx.insert(sectionItem).values({
        section_id: sectionId,      
        item_id: addedVideo[0].id,
        content_type: 'video',
        order: currentMaxOrder + 1,
        title: addedVideo[0].title,
        duration:newVideo.duration
      });
  
      return addedVideo;
    });
  };