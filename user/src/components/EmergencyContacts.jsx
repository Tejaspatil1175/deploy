import React from "react";

const EmergencyContacts = () => {
  const emergencyNumbers = [
    { name: "Emergency Services", number: "108", description: "Police, Ambulance, Fire" },
    { name: "Fire Department", number: "101", description: "Fire emergencies only" },
    { name: "Police", number: "100", description: "Police emergencies" },
    { name: "Ambulance", number: "102", description: "Medical emergencies" },
    { name: "Disaster Management", number: "108", description: "Natural disasters" },
    { name: "Women Helpline", number: "1091", description: "Women safety" },
    { name: "Child Helpline", number: "1098", description: "Child protection" },
    { name: "Mental Health", number: "1800-599-0019", description: "Mental health support" }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center">
        <span className="text-red-500 mr-2">🚨</span>
        Emergency Contacts
      </h3>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {emergencyNumbers.map((contact, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-800">{contact.name}</h4>
                <span className="text-lg font-bold text-red-600">{contact.number}</span>
              </div>
              <p className="text-xs text-gray-600">{contact.description}</p>
            </div>
            <a 
              href={`tel:${contact.number}`}
              className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-red-700 transition-colors flex-shrink-0"
            >
              Call
            </a>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          <span className="font-semibold">💡 Tip:</span> Save these numbers in your phone for quick access during emergencies.
        </p>
      </div>
    </div>
  );
};

export default EmergencyContacts;
