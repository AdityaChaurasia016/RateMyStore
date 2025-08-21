const submitRating = async (req, res) => {
  const supabase = req.app.get('supabase');
  const userId = req.user.id;
  const { store_id, rating } = req.body;

  if (!store_id || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'store_id and rating 1-5 required' });
  }

  try {
    const { data: existing, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('user_id', userId)
      .eq('store_id', store_id)
      .single();

    if (error) {
      await supabase.from('ratings').insert([{ user_id: userId, store_id, rating }]);
      return res.status(201).json({ message: 'Rating submitted' });
    } else {
      return res.status(400).json({ message: 'Rating already exists, consider update' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateRating = async (req, res) => {
  const supabase = req.app.get('supabase');
  const userId = req.user.id;
  const ratingId = req.params.id;
  const { rating } = req.body;

  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'rating must be 1-5' });
  }

  try {
    const { data: existingRating, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('id', ratingId)
      .eq('user_id', userId)
      .single();

    if (error || !existingRating) return res.status(404).json({ message: 'Rating not found' });

    const { error: updateError } = await supabase
      .from('ratings')
      .update({ rating, updated_at: new Date().toISOString() })
      .eq('id', ratingId);

    if (updateError) throw updateError;
    return res.json({ message: 'Rating updated' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getRatingsForStoreOwner = async (req, res) => {
  const supabase = req.app.get('supabase');
  const ownerId = req.user.id;

  try {
    const { data: stores, error: storesError } = await supabase
      .from('stores')
      .select('id, name')
      .eq('owner_id', ownerId); 

    if (storesError) throw storesError;

    const storeIds = stores.map((s) => s.id);
    if (storeIds.length === 0) return res.json({ stores: [], ratings: [] });

    const { data: ratings, error: ratingError } = await supabase
      .from('ratings')
      .select('user_id, rating, store_id')
      .in('store_id', storeIds);

    if (ratingError) throw ratingError;

    return res.json({ stores, ratings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitRating, updateRating, getRatingsForStoreOwner };