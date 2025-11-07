import { Button } from '@/components/ui/button';

interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  activity: string;
  difficulty: string;
  distance: string;
  elevation: string;
  priorExperience: string;
  imageUrl: string;
}

export default function App() {
  const trips: Trip[] = [
    {
      id: '1',
      title: 'YURRR YOSEMITE',
      startDate: 'Fri, Nov 7, 2025',
      endDate: 'Sun, Nov 9, 2025',
      startTime: '11:00 AM',
      endTime: '7:00 PM',
      activity: 'Hiking, Camping (Glamping)',
      difficulty: '(7/10) Medium',
      distance: '12 miles',
      elevation: '2500 ft',
      priorExperience: 'Long hiking experience at elevation!',
      imageUrl: 'https://images.unsplash.com/photo-1515215563220-76611b256ef4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3NlbWl0ZSUyMHdhdGVyZmFsbCUyMGhpa2luZ3xlbnwxfHx8fDE3NjI1NDEzMzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: '2',
      title: 'DUNE \'N DIRTY',
      startDate: 'Sat, Nov 8, 2025',
      endDate: 'Sun, Nov 9, 2025',
      startTime: '6:30 AM',
      endTime: '7:00 PM',
      activity: 'hiking, camping, scrambling, sand sledding, becoming Lisan al-Gaib',
      difficulty: '(4/10) Easy/Medium',
      distance: '6miles / 9.7 km',
      elevation: '700 ft / 213 m',
      priorExperience: 'hiking experience recommended, should be comfortable with scrambling',
      imageUrl: 'https://images.unsplash.com/photo-1550252354-15cc4ab76a59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kJTIwZHVuZXMlMjBoaWtpbmclMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzYyNTQxMzM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: '3',
      title: 'WHITE MOUNTAINS ADVENTURE',
      startDate: 'Fri, Nov 14, 2025',
      endDate: 'Sun, Nov 16, 2025',
      startTime: '5:00 AM',
      endTime: '8:00 PM',
      activity: 'Backpacking, Summit Hiking, Camping',
      difficulty: '(8/10) Advanced',
      distance: '15 miles',
      elevation: '4200 ft',
      priorExperience: 'Previous multi-day backpacking experience required',
      imageUrl: 'https://images.unsplash.com/photo-1607672390383-aa666b4761ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGNhbXBpbmclMjBiYWNrcGFja2luZ3xlbnwxfHx8fDE3NjI1NDEzMzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
  ];

  const formatDateBadge = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    return { month, day };
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-900 text-white border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="tracking-wider text-white">SC OUTFITTERS</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">HOME</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">WHO WE ARE</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">RESOURCES</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">INFO</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">TRIP DETAILS</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">SCHOLARSHIPS</a>
              <Button 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 rounded-full px-6"
              >
                TRIPS!
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Trips List */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {trips.map((trip, index) => {
            const startBadge = formatDateBadge(trip.startDate);
            const endDate = new Date(trip.endDate);
            const endMonth = endDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
            const endDay = endDate.getDate();

            return (
              <div key={trip.id} className="flex gap-6 pb-8 border-b border-gray-200 last:border-b-0">
                {/* Trip Image with Date Badge */}
                <div className="relative flex-shrink-0">
                  <ImageWithFallback
                    src={trip.imageUrl}
                    alt={trip.title}
                    className="w-56 h-44 object-cover"
                  />
                  
                  {/* Date Badge */}
                  <div className="absolute top-3 right-3 bg-white shadow-lg border border-gray-200 text-center py-2 px-3 min-w-[70px]">
                    <div className="text-gray-600 text-xs">{startBadge.month}</div>
                    <div className="text-gray-900 text-2xl leading-none">{startBadge.day}</div>
                    <div className="text-gray-500 text-xs mt-1">to {endMonth} {endDay}</div>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-gray-900 mb-2">{trip.title}</h2>
                  
                  <div className="space-y-2 text-gray-600">
                    <p>
                      {trip.startDate}, {trip.startTime} – {trip.endDate}, {trip.endTime}
                    </p>
                    
                    <p>
                      <span className="text-gray-700">Activity:</span> {trip.activity}
                    </p>
                    
                    <p>
                      <span className="text-gray-700">Difficulty:</span> {trip.difficulty} <span className="text-gray-700">Distance (miles):</span> {trip.distance} <span className="text-gray-700">Elevation (ft):</span> {trip.elevation}
                    </p>
                    
                    <p>
                      <span className="text-gray-700">Recommended Prior Experience:</span> {trip.priorExperience}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
