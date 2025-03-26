'use client';

import { useRouter } from 'next/navigation';
import BookingForm from '../components/booking/booking-form';

export default function BookingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Buchungsanfrage
          </h1>
          <p className="text-xl text-gray-400">
            Wählen Sie den gewünschten Dienst und füllen Sie das Formular aus.
          </p>
        </div>
        
        <BookingForm onClose={() => router.push('/')} />
      </div>
    </div>
  );
} 