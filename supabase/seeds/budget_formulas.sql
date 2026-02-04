INSERT INTO "public"."budget_formulas" ("formulas", "updated_at") VALUES ('# constants
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
total_people = num_participants + num_participant_drivers + num_guides
total_participants = num_participants + num_participant_drivers

# transportation
gas_cost = price_of_gas * num_cars * total_miles / average_mpg 
driver_incentive = (num_nights >= 1) ? driver_incentive_overnight : driver_incentive_day_trip
total_transportation_cost = gas_cost + (num_cars > 0 ? driver_incentive : 0)

# food
food_cost_per_person = breakfasts * price_of_breakfast + lunches * price_of_lunch + dinners * price_of_dinner + snacks * price_of_snack
total_food_cost = total_people * food_cost_per_person

# other
raw_trip_cost = total_transportation_cost + total_food_cost + total_other_expenses
adjusted_trip_price = raw_trip_cost * (1 + profit_margin) * (1 + stripe_percentage_fee) + (total_participants * stripe_fixed_fee)
base_price = adjusted_trip_price / total_participants 

# final prices
driver_price = ceil((base_price - ((1 / total_participants) * total_transportation_cost)) * additional_driver_discount)
member_price = ceil((adjusted_trip_price - (num_participant_drivers * driver_price)) / num_participants)
nonmember_price = ceil(member_price * (1 + nonmember_markup))

# final budget
gas_budget = gas_cost
food_budget = total_food_cost
other_budget = total_other_expenses

', '2026-01-31 02:24:41.147171+00');