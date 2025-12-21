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

	

