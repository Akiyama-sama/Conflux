export interface Location {
    type: "Feature";
    geometry: {
      type: "Point";
      coordinates: [number, number];
    };
    properties: {
      name: string;
      phoneFormatted: string;
      phone: string;
      address: string;
      city: string;
      country: string;
      postalCode: string;
      state: string;
    };
  }
  export const storeLocations: Location[] = [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-74.013877, 40.713201

        ]
      },
      "properties": {
        "name": "Foggy Bottom",
        "phoneFormatted": "(202) 507-8357",
        "phone": "2025078357",
        "address": "2221 I St NW",
        "city": "Washington DC",
        "country": "United States",
        "postalCode": "20037",
        "state": "D.C."
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-74.015995, 40.707011

        ]
      },
      "properties": {
        "name": "Dupont",
        "phoneFormatted": "(202) 387-9338",
        "phone": "2023879338",
        "address": "1512 Connecticut Ave NW",
        "city": "Washington DC",
        "country": "United States",
        "postalCode": "20036",
        "state": "D.C."
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-74.000683, 40.707729

        ]
      },
      "properties": {
        "name": "Capitol Hill",
        "phoneFormatted": "(202) 547-9338",
        "phone": "2025479338",
        "address": "221 Pennsylvania Ave SE",
        "city": "Washington DC",
        "country": "United States",
        "postalCode": "20003",
        "state": "D.C."
      }
    },      
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-73.995485, 40.709032

        ]
      },
      "properties": {
        "name": "14th + W",
        "phoneFormatted": "(215) 386-1365",
        "phone": "2025062956",
        "address": "1325 W St NW",
        "city": "Washington DC",
        "country": "United States",
        "postalCode": "20009",
        "state": "D.C."
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-73.977081, 40.713682

        ]
      },
      "properties": {
        "name": "Farragut Square",
        "phoneFormatted": "(202) 506-3079",
        "phone": "2025063079",
        "address": "888 17th St NW",
        "city": "Washington DC",
        "country": "United States",
        "postalCode": "20006",
        "state": "D.C."
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-73.987185, 40.722161

        ]
      },
      "properties": {
        "name": "Georgetown",
        "phoneFormatted": "(202) 838-4300",
        "phone": "2028384300",
        "address": "1044 Wisconsin Ave NW",
        "city": "Washington DC",
        "country": "United States",
        "postalCode": "20007",
        "state": "D.C."
      }
    },
  { 
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-73.979462, 40.724841

        ]
      },
      "properties": {
        "name": "Logan Circle",
        "phoneFormatted": "(202) 234-7336",
        "phone": "2022347336",
        "address": "1461 P St NW",
        "city": "Washington DC",
        "country": "United States",
        "postalCode": "20005",
        "state": "D.C."
      }
    },
  { 
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-73.976267, 40.734462

        ]
      },
      "properties": {
        "name": "Mount Vernon",
        "phoneFormatted": "(202) 793-7300 ",
        "phone": "2027937300 ",
        "address": "601 Massachusetts Avenue Northwest suite 110",
        "city": "Washington DC",
        "country": "United States",
        "postalCode": "20001",
        "state": "D.C."
      }
    },
  { 
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-73.973768, 40.739187

        ]
      },
      "properties": {
        "name": "Navy Yard",
        "phoneFormatted": "(202) 554-7336 ",
        "phone": "2025547336 ",
        "address": " 1212 4th St SE",
        "city": "Washington DC",
        "country": "United States",
        "postalCode": "20003",
        "state": "D.C."
      }
    },
  { 
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-73.965055, 40.718853

        ]
      },
      "properties": {
        "name": "Penn Quarter",
        "phoneFormatted": "(202) 804-2250 ",
        "phone": "2028042250 ",
        "address": "624 E. Street, NW",
        "city": "Washington DC",
        "country": "United States",
        "postalCode": "20004",
        "state": "D.C."
      }
    },
  { 
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-73.983171, 40.704847

        ]
      },
      "properties": {
        "name": "Union Market",
        "phoneFormatted": "(202) 891-5954   ",
        "phone": "2028915954   ",
        "address": "1304 4th Street Northeast",
        "city": "Washington DC",
        "country": "United States",
        "postalCode": "20002",
        "state": "D.C."
      }
    },
  { 
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-73.998544, 40.700689

        ]
      },
      "properties": {
        "name": "West End",
        "phoneFormatted": "(202) 629-2100   ",
        "phone": "2026292100  ",
        "address": "2238 M St NW",
        "city": "Washington DC",
        "country": "United States",
        "postalCode": "20037",
        "state": "D.C."
      }
    }
  ];
 
 
  /*  export const storeLocations: Location[] = [
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [119.223535, 26.042430]
          },
          "properties": {
            "name": "Foggy Bottom",
            "phoneFormatted": "(202) 507-8357",
            "phone": "2025078357",
            "address": "2221 I St NW",
            "city": "Washington DC",
            "country": "United States",
            "postalCode": "20037",
            "state": "D.C."
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [119.238423, 26.036134]
          },
          "properties": {
            "name": "Dupont",
            "phoneFormatted": "(202) 387-9338",
            "phone": "2023879338",
            "address": "1512 Connecticut Ave NW",
            "city": "Washington DC",
            "country": "United States",
            "postalCode": "20036",
            "state": "D.C."
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [119.227236, 26.020504]
          },
          "properties": {
            "name": "Capitol Hill",
            "phoneFormatted": "(202) 547-9338",
            "phone": "2025479338",
            "address": "221 Pennsylvania Ave SE",
            "city": "Washington DC",
            "country": "United States",
            "postalCode": "20003",
            "state": "D.C."
          }
        },      
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [119.228102, 26.017780]
          },
          "properties": {
            "name": "14th + W",
            "phoneFormatted": "(215) 386-1365",
            "phone": "2025062956",
            "address": "1325 W St NW",
            "city": "Washington DC",
            "country": "United States",
            "postalCode": "20009",
            "state": "D.C."
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [119.217492, 26.037625]
          },
          "properties": {
            "name": "Farragut Square",
            "phoneFormatted": "(202) 506-3079",
            "phone": "2025063079",
            "address": "888 17th St NW",
            "city": "Washington DC",
            "country": "United States",
            "postalCode": "20006",
            "state": "D.C."
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [119.215938, 26.047395]
          },
          "properties": {
            "name": "Georgetown",
            "phoneFormatted": "(202) 838-4300",
            "phone": "2028384300",
            "address": "1044 Wisconsin Ave NW",
            "city": "Washington DC",
            "country": "United States",
            "postalCode": "20007",
            "state": "D.C."
          }
        },
      { 
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [119.231354, 26.047286]
          },
          "properties": {
            "name": "Logan Circle",
            "phoneFormatted": "(202) 234-7336",
            "phone": "2022347336",
            "address": "1461 P St NW",
            "city": "Washington DC",
            "country": "United States",
            "postalCode": "20005",
            "state": "D.C."
          }
        },
      { 
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [119.225527, 26.020783]
          },
          "properties": {
            "name": "Mount Vernon",
            "phoneFormatted": "(202) 793-7300 ",
            "phone": "2027937300 ",
            "address": "601 Massachusetts Avenue Northwest suite 110",
            "city": "Washington DC",
            "country": "United States",
            "postalCode": "20001",
            "state": "D.C."
          }
        },
      { 
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [119.251637, 26.070562]
          },
          "properties": {
            "name": "Navy Yard",
            "phoneFormatted": "(202) 554-7336 ",
            "phone": "2025547336 ",
            "address": " 1212 4th St SE",
            "city": "Washington DC",
            "country": "United States",
            "postalCode": "20003",
            "state": "D.C."
          }
        },
      { 
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [119.270011, 26.053570]
          },
          "properties": {
            "name": "Penn Quarter",
            "phoneFormatted": "(202) 804-2250 ",
            "phone": "2028042250 ",
            "address": "624 E. Street, NW",
            "city": "Washington DC",
            "country": "United States",
            "postalCode": "20004",
            "state": "D.C."
          }
        },
      { 
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [119.245407, 26.080706]
          },
          "properties": {
            "name": "Union Market",
            "phoneFormatted": "(202) 891-5954   ",
            "phone": "2028915954   ",
            "address": "1304 4th Street Northeast",
            "city": "Washington DC",
            "country": "United States",
            "postalCode": "20002",
            "state": "D.C."
          }
        },
      { 
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [119.235213, 26.103460]
          },
          "properties": {
            "name": "West End",
            "phoneFormatted": "(202) 629-2100   ",
            "phone": "2026292100  ",
            "address": "2238 M St NW",
            "city": "Washington DC",
            "country": "United States",
            "postalCode": "20037",
            "state": "D.C."
          }
        }
      ]; */