
import { Context } from "hono";
import z, { success } from "zod";
import { createResource } from "../../queries/admin/resource.queries";
import {uploadResourcesToGCS} from '../../util/gcs-upload'



const resourceSchema = z.object({
    title:z.string(),
    description:z.string(),
    resources:z.instanceof(File)
})




export const uploadResources = async(c:Context)=>{
    const sectionId = c.req.param("sectionId")
    const body = await c.req.formData()
    const title = body.get('title')?.toString()!
    const description = body.get('description')?.toString()!
    const resources = body.get('resources') as File



    const parsed = resourceSchema.parse({title,description,resources})
    try {
        const uploadedResource = await uploadResourcesToGCS(parsed.resources)
        if(!uploadedResource){
            return c.json({success:false, message:'Failed to upload to gcs'})
        }
        const resource = await createResource({title:parsed.title,description:parsed.description,resource_url:uploadedResource, section_id:sectionId})
        if(resource){
            return c.json({success:true,message:'Resource upload successfully'})
           
        }
        return c.json({success:false,message:'Failed to save resource'})

    } catch (error) {
        return c.json({sucess:false,message:'Failed to save resource'})
    }
 
}