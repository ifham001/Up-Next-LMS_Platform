import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { section , ISection , sectionItem } from "../../schema/admin/section";
import { dbDrizzle } from "../../config/pg.db";
import { video } from "../../schema/admin/video";
import { quiz , quizQuestion , quizQuestionOption } from "../../schema/admin/quiz";
import { deleteFilesFromGCS } from "../../util/gcs-upload";
import { resource } from "../../schema/admin/resource";


export const getSectionItem = async (sectionId: string) => {
    return await dbDrizzle.select().from(sectionItem).where(eq(sectionItem.section_id, sectionId));
  };
  export const sectionFinalize = async (sectionId: string) => {
 return await dbDrizzle.update(section).set({ section_status: 'completed' }).where(eq(section.id, sectionId));
  };

export const createCourseSection = async (newCourseSection: ISection) => {
    const sectionIsInDraft = await dbDrizzle
    .select()
    .from(section)
    .where(
        and(
            eq(section.course_id, newCourseSection.course_id),
            eq(section.section_status, "in_progress"))
     ).limit(1);    
     if(sectionIsInDraft.length > 0){
        return {sectionId: sectionIsInDraft[0].id,sectionNumber: sectionIsInDraft[0].section_number,draft: true};
     }

  const maxSection = await dbDrizzle
    .select({ maxSectionNumber: sql<number>`MAX(${section.section_number})` })
    .from(section)
    .where(eq(section.course_id, newCourseSection.course_id));

  const currentMax = maxSection[0].maxSectionNumber ?? 0;

 const sectionCreated = await dbDrizzle
    .insert(section)
    .values({ ...newCourseSection, section_number: currentMax + 1 })
    .returning();

  return {sectionId: sectionCreated[0].id,sectionNumber: sectionCreated[0].section_number,draft: false};
};


export const getDraftedSections = async (courseId: string) => {
    const draftCourseSection = await dbDrizzle
      .select()
      .from(section)
      .where(eq(section.course_id, courseId))
      .orderBy(asc(section.section_number));
  
    if (draftCourseSection.length === 0) {
      return { draftCourseSection: [], getSectionItems: [] };
    }
  
    const sectionIds = draftCourseSection.map((sec) => sec.id);
  
    const getSectionItems = await dbDrizzle
      .select()
      .from(sectionItem)
      .where(inArray(sectionItem.section_id, sectionIds))
      .orderBy(asc(sectionItem.order));
  
    return { draftCourseSection, getSectionItems };
  };

  export const deleteSection = async (sectionId: string) => {
    if (!sectionId || sectionId === "undefined") {
  
      return {message:' 3 Invalid sectionId provided for deletion', success:false }
    }
  
   const sectionDelete=  await dbDrizzle.transaction(async (tx) => {
      try {
        // Get section info (we need courseId and order)
        const [sectionToDelete] = await tx.select().from(section).where(eq(section.id, sectionId));
        if (!sectionToDelete) {
          throw new Error("Section not found");
        }
        const courseId = sectionToDelete.course_id;
        const deletedSectionOrder = sectionToDelete.section_number;
  
        // Delete videos and files
        const videos = await tx.select().from(video).where(eq(video.section_id, sectionId));
        if (videos.length > 0) {
          await deleteFilesFromGCS(videos.map((v) => v.url));
          await tx.delete(video).where(eq(video.section_id, sectionId));
        }
        const resources = await tx.select().from(resource).where(eq(resource.section_id,sectionId));
        if(resources.length> 0){
            await deleteFilesFromGCS(resources.map((pdf) => pdf.resource_url));
            await tx.delete(resource).where(eq(resource.section_id, sectionId));
        }
  
        // Delete quizzes and related
        const quizzes = await tx.select().from(quiz).where(eq(quiz.section_id, sectionId));
        if (quizzes.length > 0) {
          const quizIds = quizzes.map((q) => q.id);
          const questions = await tx.select().from(quizQuestion).where(inArray(quizQuestion.quiz_id, quizIds));
          if (questions.length > 0) {
            const questionIds = questions.map((q) => q.id);
            await tx.delete(quizQuestionOption).where(inArray(quizQuestionOption.quiz_question_id, questionIds));
            await tx.delete(quizQuestion).where(inArray(quizQuestion.id, questionIds));
          }
          await tx.delete(quiz).where(inArray(quiz.id, quizIds));
        }
  
        // Delete section items
        await tx.delete(sectionItem).where(eq(sectionItem.section_id, sectionId));
  
        // Delete section itself
        await tx.delete(section).where(eq(section.id, sectionId));
  
        // ✅ Reorder remaining sections of the course
        const remainingSections = await tx
          .select()
          .from(section)
          .where(eq(section.course_id, courseId));
  
        // Sort and renumber
        const reorderedSections = remainingSections
          .sort((a, b) => a.section_number - b.section_number)
          .map((s, index) => ({ ...s, section_number: index + 1 }));
  
        // Update each section
        for (const sec of reorderedSections) {
          await tx.update(section).set({ section_number: sec.section_number }).where(eq(section.id, sec.id));
        }
  
        return {message:'Section Deleted successfully', success:true }
      } catch (error) {
        return {message:'2 Section not Deleted successfully', success:false }
        
       
      }
    });
    return sectionDelete
   
  };
  