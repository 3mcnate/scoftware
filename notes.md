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


Trip settings
 - Name
 - start date
 - end date
 - participant spots
 - driver spots
 - add/remove guides (I think for now any guide can add/remove any other guide)
 - Trip cycle dates override:
		- trip published date
		- member signup date
		- nonmember signup date
		- driver signup date
 - Signup settings:
		- allow signups (yes/no)
		- enable waitlist (yes/no)
		  - Participants must join the waitlist, even if there is a spot available. Participants can only sign up for the trip if they are sent a waitlist email. This will turn on automatically when the trip is full.
		- require code
 - Destructive settings:
	  - leave trip
		- delete trip (only available if there are no signups)


Trip publish logic
	- the existence of row in published_trips table implies the trip is "Ready". No need for ready_to_publish column
  - for trip to be visible: must exist in published_trips table, must have visible = true in trips table, must be past the override date or trip cycle date publish date. 

Your task is to implement trip publishing from end to end. 

1. Create the backend route, POST /api/trips/publish. It should accept a tripId as JSON in the body. Use Zod for validation.

What needs to happen when you publish a trip:
	- check that all required fields are filled out
		- description
		- what_to_bring
		- picture_path
		- activity
		- difficulty
		- location
		- meet
		- native_land
		- prior_experience
		- return
		- trail
		- 
		- budget_confirmed
		- 
	- insert row into published_trips table
	- create stripe products/prices, add to trip_prices table
		- use budget formulas with input data or the override prices

	- 


Budget formulas: mathjs library

Inputs:
- breakfasts
- lunches
- dinners
- snacks
- total_miles
- num_cars
- average_mpg
- total_other_expenses
- num_participants
- num_participant_drivers
- num_guides
- num_nights

Outputs
- member_price			# required
- nonmember_price		# required
- driver_price			# required
- food_budget				# required
- gas_budget 				# required
- other_budget			# required
... anything else		

csv export?


gas_price = 4.50
gas_budget = gas_price * num_cars * total_miles / average_mpg 

base_price = food_budget + gas_budget
total_people = num_participants + num_drivers
member_price = base_price / total_people

# constants
price_of_gas = 4.85
price_of_breakfast = 1.50
price_of_lunch = 4.20
price_of_dinner = 3
price_of_snack = 3.50

profit_margin = 0.05
nonmember_markup = 0.3
additional_driver_discount = 0.8

driver_incentive_day_trip = 10
driver_incentive_overnight = 20

stripe_percentage_fee = 0.029
stripe_fixed_fee = 0.3

# helpers
total_people = num_participants + num_drivers + num_guides
total_participants = num_participants + num_participant_drivers

# transportation
gas_cost = price_of_gas * num_cars * total_miles / average_mpg 
driver_incentive = num_nights >= 1 ? driver_incentive_overnight : driver_incentive_day_trip
total_transportation_cost = gas_cost + driver_incentive

# food
food_cost_per_person = breakfasts * price_of_breakfast + lunches * price_of_lunches + dinners * price_of_dinners + snacks * price_of_snacks
total_food_cost = total_people * food_cost_per_person

# other
raw_trip_cost = total_transportation_cost + total_food_cost + total_other_expenses
adjusted_trip_price = raw_trip_cost * (1 + profit_margin) * (1 + stripe_percentage_fee) + (total_participants * stripe_fixed_fee)
base_price = adjusted_trip_price / total_participants 

# final prices
driver_price = (base_price - ((1 / total_participants) * total_transportation_costs)) * additional_driver_discount
member_price = (adjusted_trip_price - (num_participant_drivers * driver_price)) / num_participants
nonmember_price = member_price * (1 + nonmember_markup)

# final budget
gas_budget = gas_cost
food_budget = food_cost
other_budget = total_other_expenses
