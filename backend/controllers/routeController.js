import axios from "axios";

export const getRoute = async (req, res, next) => {
  try {
    const { from, to, profile } = req.query;
    if (!from || !to) return res.status(400).json({ message: 'from and to are required' });
    const [fromLat, fromLng] = from.split(',').map(Number);
    const [toLat, toLng] = to.split(',').map(Number);
    const travelProfile = profile || 'driving-car';
    const url = `https://api.openrouteservice.org/v2/directions/${travelProfile}?api_key=${process.env.ORS_API_KEY}&start=${fromLng},${fromLat}&end=${toLng},${toLat}`;
    const orsRes = await axios.get(url);
    res.json(orsRes.data);
  } catch (err) {
    next(err);
  }
};
