import { Context } from "hono";
import { z } from "zod";
import { archiveCourse, courseFinalize, createCourse, deleteCourse,lifeTimeCourseDetail  ,getDraftCourse, updatedPrice} from "../../queries/admin/course.queries";
import { uploadFileToGCS, uploadThumbnailToGCS } from '../../util/gcs-upload'


const toArray = (val: unknown) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return [val];
    return [];
  };

export const createCourseSchema = z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    domain: z.enum(['Information Technology', 'Business', 'Language', 'Marketing', 'Management', 'Other']),
    tagline: z.string(),
    requirements: z.preprocess(toArray, z.array(z.string())),
    benefits: z.preprocess(toArray, z.array(z.string())),
    thumbnail_url: z.string(),
    url: z.string(),
    duration:z.number(),
});




export const addNewCourse = async (c: Context) => {

try {
    const body = await c.req.json();
    //  export interface ICourse {
        //     title: string;
        //     tagline: string;
        //     description: string;
        //     price: number;
        //     thumbnail: string;
        //     domain: 'Information Technology' | 'Business' | 'Language' | 'Marketing' | 'Management' | 'Other';
        //     requirements: string[];
        //     benefits: string[];
        //     preview_video: string;
        //     preview_video_duration:number
        //   }
    
     
      const {title,description,domain,duration,requirements,benefits,thumbnail_url,tagline,url,price} = createCourseSchema.parse(body); 
      const course = await createCourse(
      {
        title,
        description,
        domain,
        requirements,
        benefits,
        tagline,
        price,
         preview_video:url
        ,thumbnail:thumbnail_url,
        preview_video_duration:duration
      }

    );
   
    if(course[0].id){
    
        return c.json({ message: ' Course create Successfully', success: true , courseId:course[0].id }, 200);
    }
    return c.json({ message:'Failed to save course', success: false }, 401);
} catch (error) {
    
    return c.json({ message:'Failed to save course', success: false }, 400);
}
}

export const getDraftCourses = async (c: Context) => {
   try {
        const courses = await getDraftCourse();
        if(!courses){
            return c.json({ error: 'No courses found', success: false }, 400);
        }
        return c.json({ courses, success: true }, 200);
    } catch (error) {
        return c.json({ error: error.message, success: false }, 400);
    }
}
export const finalizeCourse = async (c: Context) => {
    try {
        const courseId = await c.req.param('courseId');
        const course = await courseFinalize(courseId);
      c.json(course)
    } catch (error) {
        return c.json({ message:'Course cannot be submitted try again!', success: false}, 200);

    }
}
export const toDeleteCourse = async(c:Context)=>{
    try {
        const courseId = await c.req.param('courseId');
        const course = await deleteCourse(courseId);
        if(course?.success){
            return c.json({ message: 'course deleted successfullt', success: true }, 200);
        }
        return c.json({ message:'first delete all section to delete course', success: false}, 200);
    } catch (error) {
        return c.json({ message:'Course cannot be deleted try again!', success: false}, 200);

    }
}
export const makeCourseArchived = async(c:Context)=>{
    
    try {
        const courseId = await c.req.param('courseId');
        const course = await archiveCourse(courseId);
        if(course[0].status==='archived'){
            return c.json({ message: 'course deleted successfullt', success: true }, 200);
        }
        return c.json({ message:'first delete all section to delete course', success: false}, 200);
    } catch (error) {
        return c.json({ message:'Course cannot be deleted try again!', success: false}, 200);

    }
}

const updatedPriceSchema = z.object({
    updatePrice:z.number()
})

export const updatedCoursePrice = async(c:Context)=>{
    try {
        const courseId = await c.req.param('courseId');
        const body = await  c.req.json()
        const {updatePrice} = updatedPriceSchema.parse(body)
        const course = await updatedPrice(courseId,updatePrice);
        if(course[0].price===updatePrice){
            return c.json({ message: 'course deleted successfullt', success: true }, 200);
        }
        return c.json({ message:'first delete all section to delete course', success: false}, 200);
    } catch (error) {
        return c.json({ message:'Course cannot be deleted try again!', success: false}, 200);

    }
}

export const courseLifeTimeDetails = async(c:Context)=>{
    try {
        const details = await lifeTimeCourseDetail()
        if(details.success){
            return c.json(details)
        }
        return c.json({message:'failed to fetch course details'},500)
    } catch (error) {
        return c.json({message:'failed to fetch course details'},401)
    }
}




