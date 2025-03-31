
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from '../components/ui/card';
export function List() {
    
    const [data, setData] = useState<any[] | null>(null);

    useEffect(() => {
    async function fetchData() {
      const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
      const result = await response.json();
      setData(result
      );
    }
    fetchData();
  }, []);

    if (!data) {
        return null;
    }

    console.log(data);

    return (
        <main>
            <div style={{ position: "fixed", right: 0, width: "50vw", height: "calc(100vh - 8rem)", overflow: "auto" }} className='grid grid-cols-3 gap-8'>
                {data.features.map((feature: any) => (
                    <Card key={feature.id}>
                        <CardHeader>
                            <CardTitle>{feature.properties.place}</CardTitle>
                            <CardDescription>{new Date(feature.properties.time).toLocaleString()}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Latitude: {feature.geometry.coordinates[1].toFixed(2)}</p>
                            <p>Longitude: {feature.geometry.coordinates[0].toFixed(2)}</p>
                            <p>Magnitude: {feature.properties.mag}</p>
                            <p>Depth: {feature.geometry.coordinates[2].toFixed(2)}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </main>
    );
}

