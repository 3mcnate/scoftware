Rich text editor: <https://shadcn-editor.vercel.app/docs/installation>

Trip page details:

Meet: Friday, 11/14, 7 A.M. @ Trader Joe’s Elevators
Return: Sunday, 11/16 around 6 P.M. 
Activity: hiking, sightseeing, camping
Difficulty: (4/10) Easy-Medium 
Trail: Distance: ~6/7 miles Elevation ~500 ft 
Recommended Prior Experience: none!
Location of Trip: Pfeiffer Big Sur State Park, Point Lobos State Natural Reserve
Native Land: Salinan, Esselen


Waiver backend setup:
trip_waivers table -> rows generated from waiver_templates table
- waiver id
- trip_id
- waiver type
- html_content
- created_at


On trip publish or waiver change:
	if the waiver has been signed
		create a new waiver row
	otherwise,
		update most recent waiver row 

Whenever user has yet to sign waiver:
	load most recent waiver with matching trip_id 

When user signs waiver:
	add to waiver events audit logging table
	generate static signed waiver with link
	update signed_waiver_link to the document we created
	send email to user saying they've signed the waiver and include the link

	

Here's the logical flow:
	When a user clicks "sign waiver", they are brought to the sign waiver page for that trip. This page loads the waiver from the trip_waivers table, depending on the ticket type ("driver" or "participant") 

Create a backend api route to process waiver completions. When the user signs a waiver, the route should be send their typed full legal name, birthday, trip Id, and waiver id. Next, the route should generate a PDF of the signed document that is an accurate visual representation of the online form they just signed. This PDF should be uploaded to the supabase storage "waivers" bucket, with the filepath being "<user_id>/<document_id>", where document_id is a randomly generated uuidv4. This filepath should be saved to their ticket in the waiver_filepath (or driver_waiver_filepath) column. The route should also add a row to the waiver_events table with a "user_signed" event. Use Drizzle to interact with the database, and place all queries in data/waivers.