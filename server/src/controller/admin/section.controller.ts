import { Context } from "hono";
import { createCourseSection, deleteSection, getDraftedSections, getSectionItem, sectionFinalize } from "../../queries/admin/section.queries";
import { z } from "zod";

const addNewSectionSchema = z.object({
    courseId: z.string(),
    title: z.string(),
    description: z.string(),
});

export const sectionFinalized = async (c: Context) => { 
    try {
        const sectionId = await c.req.param('sectionId');
        const section = await sectionFinalize(sectionId);
        
        if(section.command){
            return c.json({ message: 'Section submit successfully', success: true }, 200);
        }
        return c.json({ message:'Section submit failed try again', success: false}, 400);
    } catch (error) {
        return c.json({ message:'Section submit failed try again', success: false}, 400);

    }
}


export const addNewSection = async (c: Context) => {
    const  body  = await c.req.json();
    try {
       
        
        const { courseId, title, description } = addNewSectionSchema.parse(body);
        const section = await createCourseSection({course_id:courseId, title, description, });
        const {sectionId,sectionNumber,draft} = section; 
        if(!sectionId){
            return c.json({ error: 'Failed to create section try again', success: false }, 400);
        }
        if(draft){
         return c.json({ message: "Please complete the previous section", draft: true, sectionNumber: sectionNumber,sectionId: sectionId, success: false })
        }
        return c.json({ message: "Course section created successfully",draft: false , sectionId: sectionId,sectionNumber: sectionNumber, success: true })
        } catch (error) {
         
    return c.json({ error: error.message, success: false }, 400);
    }
}

export const getDraftSections = async (c: Context) => {
    try {
        const courseId = await c.req.param('courseId');
        const sections = await getDraftedSections(courseId);
        if(!sections){
            return c.json({ error: 'failed to get sections', success: false }, 400);
        }
        const { draftCourseSection, getSectionItems } = sections;
        if(!draftCourseSection){
            return c.json({ error: 'No sections found', success: false }, 400);
        }
        return c.json({ draftCourseSection, getSectionItems, success: true }, 200);
    } catch (error) {
        return c.json({ error: error.message, success: false }, 400);
    }
}
export const onDeleteSection = async (c: Context) => {
    const sectionId = c.req.param("sectionId");
    const {message , success} = await deleteSection(sectionId);
    console.log(success,message)
    if(success){
      return c.json({ message: "Section deleted successfully", success:true });
    }
    return c.json({ message: "Section not deleted" ,success:false }, 400);
  };
  export const getSectionItemList = async (c: Context) => {
    const sectionId = c.req.param("sectionId");
    const sectionItem = await getSectionItem(sectionId);
    
    return c.json({ message: "Section item fetched successfully", sectionItem: sectionItem ? sectionItem : [] });
  };