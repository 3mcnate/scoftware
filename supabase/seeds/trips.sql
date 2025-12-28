INSERT INTO
	"public"."trips" (
		"id",
		"created_at",
		"updated_at",
		"name",
		"description",
		"picture_path",
		"driver_spots",
		"participant_spots",
		"end_date",
		"start_date",
		"gear_questions",
		"signup_status",
		"what_to_bring",
		"access_code"
	)
VALUES
	(
		'af6192f6-2565-49bf-ab29-9d2e97cb9740',
		'2025-11-26 21:16:12.053215+00',
		'2025-11-26 21:16:12.053215+00',
		'Falls and Feathers at Whitney Canyon
',
		'Need to touch grass over study days? Join us for a wet and wild excursion featuring a waterfall, a scenic canyon, a bird sanctuary, and more :)

 We will leave from the USC village at 9am on Saturday for a quick and easy drive to the Whitney Canyon Falls Trailhead. From there, it’ll be a 3-mile round trip hike through the canyon to the waterfall. There will be some light rock scrambling and perhaps a few water crossings. We’ll plan to eat lunch at the waterfall and then frolic our way back to the trailhead. The fun doesn’t stop there—we will then visit the nearby Placerita Canyon Nature Center which has a bird rehab center, an active bee hive, snakes,  live insect specimens, and a variety of other awesome nature exhibits. After delighting in Southern California’s native wildlife, we plan to return home to USC by 5pm feeling grounded and ready for finals. 

',
		'af6192f6-2565-49bf-ab29-9d2e97cb9740/trip-pic-3.webp',
		'1',
		'7',
		'2026-12-07 01:00:00+00',
		'2026-12-06 17:00:00+00',
		null,
		'open',
		'2+ liters of water
Hat/sunscreen/sunglasses
Comfortable hiking shoes
Comfortable hiking clothes',
		null
	),
	(
		'd8aaea9d-85bf-4dcf-a63d-001e19dea7af',
		'2025-11-26 22:01:07.738942+00',
		'2025-11-26 22:01:07.738942+00',
		'Bearly Been Backpacking at Bear Creek',
		null,
		'd8aaea9d-85bf-4dcf-a63d-001e19dea7af/trip-pic-2.webp',
		'0',
		'8',
		'2025-11-24 01:00:00+00',
		'2025-11-22 17:00:00+00',
		null,
		'open',
		null,
		null
	);

INSERT INTO
	"public"."published_trips" (
		"id",
		"created_at",
		"updated_at",
		"name",
		"picture_path",
		"start_date",
		"end_date",
		"meet",
		"return",
		"activity",
		"difficulty",
		"trail",
		"recommended_prior_experience",
		"location",
		"native_land",
		"description",
		"what_to_bring",
		"guides"
	)
VALUES
	(
		'af6192f6-2565-49bf-ab29-9d2e97cb9740',
		'2025-11-26 21:26:06.449599+00',
		'2025-11-26 21:26:06.449599+00',
		'Falls and Feathers at Whitney Canyon
',
		'af6192f6-2565-49bf-ab29-9d2e97cb9740/trip-pic-3.webp',
		'2026-12-06 17:00:00+00',
		'2026-12-07 01:00:00+00',
		'Saturday 12/6 at Hecuba in the Village @9AM',
		'5 PM (probs earlier)',
		'hiking, frolicking, waterfall watching, bird watching, nature center',
		'(3/10) Easy',
		'Distance: 3 miles / 4.8 km, elevation: 305 ft / 93 m',
		'none needed!',
		'Whitney Canyon Waterfalls',
		'Fernandeño Tataviam; Tongva (Gabrieleno) ',
		'Need to touch grass over study days? Join us for a wet and wild excursion featuring a waterfall, a scenic canyon, a bird sanctuary, and more :)

 We will leave from the USC village at 9am on Saturday for a quick and easy drive to the Whitney Canyon Falls Trailhead. From there, it’ll be a 3-mile round trip hike through the canyon to the waterfall. There will be some light rock scrambling and perhaps a few water crossings. We’ll plan to eat lunch at the waterfall and then frolic our way back to the trailhead. The fun doesn’t stop there—we will then visit the nearby Placerita Canyon Nature Center which has a bird rehab center, an active bee hive, snakes,  live insect specimens, and a variety of other awesome nature exhibits. After delighting in Southern California’s native wildlife, we plan to return home to USC by 5pm feeling grounded and ready for finals. ',
		'{"2+ liters of water","Hat/sunscreen/sunglasses","Comfortable hiking shoes","Comfortable hiking clothes"}',
		'[{"name": "Zara Khan", "email": "zaraminakhan@gmail.com"}, {"name": "Sedona Silva", "email": "slsilva@usc.edu"}]'
	),
	(
		'd8aaea9d-85bf-4dcf-a63d-001e19dea7af',
		'2025-11-26 22:14:23.886146+00',
		'2025-11-26 22:14:23.886146+00',
		'Bearly Been Backpacking at Bear Creek
',
		'd8aaea9d-85bf-4dcf-a63d-001e19dea7af/trip-pic-2.webp',
		'2025-11-22 17:30:00+00',
		'2025-11-24 01:00:00+00',
		'Saturday 11/22 in USC Village @ 9:30am',
		'Sunday 11/23 @ 4pm',
		'hiking, introductory backpacking, hot spring dipping, spikeball, stargazing',
		'(5/10) Medium',
		'Distance: 8.6 miles / 13.8 km Elevation: 711 ft / 218 m',
		'none',
		'Sespe River in Los Padres National Forest',
		'Kumeyaay/Kumiais',
		'Pre-Trip Meeting: Wednesday 11/19 @ 8:30 pm for gear. Meet at SC Outfitter’s House Shack (2647 Orchard Avenue)

Can’t bear not knowing how to backpack? Come join Pirka and Ryan on a life changing journey which will adorn you with the skill set to take on any backpacking adventure. Come ready to learn!

We will meet will our fellow travelers at 9:30 am in the USC village and embark on our 3 hour journey to the Sespe River. Our 4.3 mile backpacking trek will begin at 12:30 pm featuring sights of the beautiful creek and cottonwood trees, stopping for a delectable lunch. 

Once we arrive at the Bear Creek campsite, we will set up camp and enjoy the solitude around us. During this transformative adventure, guides Pirka and Ryan will lead you through every step of backpacking, sharing lessons and prepping participants to better understand concepts of: 

Route selection

What to bring? (sleep systems, fire systems, layering systems)

How to pack a backpack

How to size a backpack

Starting a fire

Water filtration

Camp stoves

Knots & tarps

Topography maps and compasses

Pooping within LNT boundaries

Bear management

And possible learning activities of:

Discuss types of routes, water selection, weather conditions, exposure, back up plans pre-trip at Shack

Properly pack and size backpacks at Shack pre-trip (what to bring, how to pack, how to size)

Do a water filtration circle, watch one, do one, teach one

Do a camp stove circle, watch one, do one, teach one

Practice tying knots and using a tarp to construct basic shelters such as an A-frame or a Lean-to

Use a topographic map to identify nearby peaks and use a compass to find a bering based off of known landmarks, potentially bush whacking

And as a reward for your hard learning, we will spend our time at the campsite playing plentiful amounts of the exhilarating game Spikeball, perhaps even dipping into the hot springs. We will finish off the day with a yummy dinner and some stargazing. 

The next morning we shall awaken at 8:30 am and start with a brisk breakfast as we break camp and commence on our 4.3 mile trek back to the cars. Around 12 pm, we will make our way back to campus, arriving home by 4 pm, adorned our newfound backpacking knowledge. ',
		'{"Sleeping bag","Sleeping pad","Mess kit (utensils and bowl/plate/tupperware)","3+ liters of water","Hat/sunscreen/sunglasses","Comfortable hiking shoes","Comfortable hiking clothes","Toiletries/medications","Headlamp/flashlight","Warm clothes for night/sleeping","Swimsuit (optional)"}',
		'[{"name": "Ryan Long", "email": "ryanwlon@usc.edu"}, {"name": "Piroska Darnyi", "email": "pdarnyi@usc.edu"}]'
	);

INSERT INTO
	"public"."tickets" (
		"id",
		"user_id",
		"trip_id",
		"created_at",
		"updated_at",
		"cancelled",
		"refunded",
		"cancelled_at",
		"stripe_payment_id",
		"type",
		"amount_paid",
		"stripe_refund_id"
	)
VALUES
	(
		'92c39690-a280-41f9-b9dd-32d822836e4b',
		'd070655d-974c-45a5-a332-eb1f499e49fd',
		'af6192f6-2565-49bf-ab29-9d2e97cb9740',
		'2025-11-27 23:06:52.904179+00',
		'2025-11-27 23:06:52.904179+00',
		'false',
		'false',
		null,
		'pi_123',
		'member',
		'80',
		null
	),
	(
		'a9c1a53c-a02b-4d7b-9c5c-6eb4f5cbecac',
		'd070655d-974c-45a5-a332-eb1f499e49fd',
		'd8aaea9d-85bf-4dcf-a63d-001e19dea7af',
		'2025-11-27 23:07:24.028357+00',
		'2025-11-27 23:07:24.028357+00',
		'false',
		'false',
		null,
		'pi_456',
		'member',
		'50',
		null
	);