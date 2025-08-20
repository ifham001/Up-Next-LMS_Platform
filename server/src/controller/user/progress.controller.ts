import { integer } from "drizzle-orm/gel-core";
import { Context } from "hono";
import z from "zod";
import { getUserVideoWithProgress ,mapVideoProgress } from "../../queries/user/progress.queries";

// export const userVideoProgress = pgTable("user_video_progress", {
//     id: uuid("id").defaultRandom().primaryKey(),
//     userId: uuid("user_id").notNull().references(() => user.id),
//     videoId: uuid("video_id").notNull().references(() => video.id),
//     watchedSeconds: integer("watched_seconds").default(0), // e.g., 150 seconds
//     isCompleted: boolean("is_completed").default(false),
//     lastWatchedAt: timestamp("last_watched_at").defaultNow(),
//   });
  


const videoProgressSchema = z.object({
    userCourseId:z.string().min(1).nonempty(),
    videoId:z.string().min(1).nonempty(),
    watchedSeconds:z.number()
})
const fetchVideoProgressSchema = z.object({
    userCourseId:z.string().min(1).nonempty(),
    videoId:z.string().min(1).nonempty(),
    
})

export const addvideoProgress = async(c:Context)=>{
try {
    const body = await c.req.json()

    const {userCourseId,videoId,watchedSeconds} =  videoProgressSchema.parse(body)
     await mapVideoProgress(userCourseId,videoId,watchedSeconds)
     return c.json({message:"All is good",success:true})
   
} catch (error) {
    return c.json({message:"failed to add progress"},401)
} 
}
  
 // Make sure this path is correct

export const getVideo = async (c: Context) => {
    try {
        const body = await c.req.json();
        const { userCourseId, videoId } = fetchVideoProgressSchema.parse(body);

        const get = await getUserVideoWithProgress(userCourseId, videoId);
       

        if (get.success) {
            return c.json(get);
        } else {
            return c.json({ message: get.message }, 404);
        }
    } catch (error) {
        console.error("Error in getVideo handler:", error);
        return c.json({ message: "Failed to show video" }, 401);
    }
};

