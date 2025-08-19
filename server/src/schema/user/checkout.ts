import { integer, pgTable, uuid, varchar ,pgEnum,text ,timestamp} from "drizzle-orm/pg-core";
import { user } from "../auth";
export const paymentModeEnum = pgEnum('payment_mode',['Card','UPI'])
export const paymentStatus = pgEnum('payment_status',['not_done', 'completed'])


export const checkout = 
pgTable('checkout',{
    id:uuid('id').defaultRandom().primaryKey(),
    name:varchar('name',{length:255}).notNull(),
    userId:uuid("user_id").references(()=>user.id).notNull(),
    address:varchar("address",{length:255}).notNull(),
    city:varchar("city",{length:50}).notNull(),
    state:varchar("state",{length:50}).notNull(),
    zip_code:integer('zip_code',).notNull(),
    purchasedAt: timestamp("purchased_at", { withTimezone: true }).defaultNow(),
    pricePaid: integer("price_paid").notNull(),
    paymentStatus: paymentStatus('payment_status').default('completed').notNull(),
    payment_mode: paymentModeEnum("payment_mode").notNull().default('Card')

})
