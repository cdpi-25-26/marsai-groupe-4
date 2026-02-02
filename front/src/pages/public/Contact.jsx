import React from "react";

export default function Contact() {
  return (
    <div className="bg-gray-950 text-white min-h-screen flex flex-col items-center px-6 py-16">
      
      {/* Заголовок по центру */}
      <h1 className="text-4xl font-bold mb-12 text-center">
        ACCÈS
      </h1>

      {/* Блоки с информацией */}
      <div className="max-w-xl w-full space-y-8 mb-12">
        
        <div className="flex items-start gap-4">
          <div className="bg-blue-600/20 p-4 rounded-xl text-2xl">🚆</div>
          <div>
            <h3 className="text-xl font-semibold">Transports en commun</h3>
            <p className="text-gray-400">Tram T2 / T3 – Arrêt Arenc Le Silo.</p>
            <p className="text-gray-400">Métro M2 – Station Désirée Clary.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-green-600/20 p-4 rounded-xl text-2xl">🚗</div>
          <div>
            <h3 className="text-xl font-semibold">Voiture</h3>
            <p className="text-gray-400">Autoroute A55 – Sortie 2.</p>
            <p className="text-gray-400">Parking Indigo Quai du Lazaret à 200m.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-purple-600/20 p-4 rounded-xl text-2xl">📍</div>
          <div>
            <h3 className="text-xl font-semibold">Adresse</h3>
            <p className="text-gray-400">
              155 Rue Peyssonnel, 13002 Marseille (Entrée principale)
            </p>
          </div>
        </div>

      </div>

      {/* КАРТА ПО ЦЕНТРУ КВАДРАТОМ */}
      <div className="w-full max-w-[500px] h-[300px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
        <iframe
          title="Google Map Marseille"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2903.0039725154948!2d5.366207076332768!3d43.31417627112024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12c9c0f3f2295ed9%3A0xe8332bddf8f8ffdb!2s155%20Rue%20Peyssonnel%2C%2013002%20Marseille!5e0!3m2!1sru!2sfr!4v1769764213092!5m2!1sru!2sfr"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

    </div>
  );
}
