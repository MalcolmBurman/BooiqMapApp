ALTER TABLE "properties" DROP CONSTRAINT "properties_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;