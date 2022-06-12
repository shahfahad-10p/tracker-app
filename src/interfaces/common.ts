interface REGION {
  id?: number;
  name?: string;
  polygon?: string;
  trackerCount?: number;
}

interface ITracker {
  id: number;
  name: string;
  latitude?: number;
  longitude?: number;
  regionName?: string;
}

export { REGION, ITracker };
