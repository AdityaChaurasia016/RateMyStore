const addStore = async (req, res) => {
  const supabase = req.app.get('supabase');
  const { name, email, address } = req.body;

  if (typeof name !== 'string' || name.length < 1 || name.length > 60)
    return res.status(400).json({ message: 'Store name required and max 60 chars' });

  if (typeof address !== 'string' || address.length > 400)
    return res.status(400).json({ message: 'Address max 400 chars' });

  try {
    const { data, error } = await supabase.from('stores').insert({ name, email, address });
    if (error) throw error;

    return res.status(201).json({ message: 'Store added successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getStoresWithRatings = async (req, res) => {
  const supabase = req.app.get('supabase');
  const userId = req.user.id;
  const { name, address } = req.query;

  try {
    let query = supabase.from('stores').select('*');

    if (name) query = query.ilike('name', `%${name}%`);
    if (address) query = query.ilike('address', `%${address}%`);

    const { data: stores, error } = await query;

    if (error) throw error;

    const storeIds = stores.map((s) => s.id);

    const { data: ratings } = await supabase
      .from('ratings')
      .select('store_id, rating, user_id')
      .in('store_id', storeIds);

    const storeRatingsMap = {};
    for (const store of stores) {
      storeRatingsMap[store.id] = {
        averageRating: null,
        userRating: null,
        ratings: [],
      };
    }

    for (const r of ratings) {
      storeRatingsMap[r.store_id].ratings.push(r.rating);
      if (r.user_id === userId) storeRatingsMap[r.store_id].userRating = r.rating;
    }

    for (const storeId of Object.keys(storeRatingsMap)) {
      const ratingObj = storeRatingsMap[storeId];
      if (ratingObj.ratings.length > 0) {
        const sum = ratingObj.ratings.reduce((a, b) => a + b, 0);
        ratingObj.averageRating = (sum / ratingObj.ratings.length).toFixed(2);
      }
    }

    const result = stores.map((store) => ({
      ...store,
      averageRating: storeRatingsMap[store.id].averageRating,
      userRating: storeRatingsMap[store.id].userRating,
    }));

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { addStore, getStoresWithRatings };
