const bcrypt = require('bcrypt');
const { nameValid, addressValid, passwordValid, emailValid } = require('../utils/validation');

const getUsers = async (req, res) => {
  const supabase = req.app.get('supabase');
  const { name, email, address, role } = req.query;

  try {
    let query = supabase.from('users').select('id, name, email, address, role');

    if (name) query = query.ilike('name', `%${name}%`);
    if (email) query = query.ilike('email', `%${email}%`);
    if (address) query = query.ilike('address', `%${address}%`);
    if (role) query = query.eq('role', role);

    const { data, error } = await query;

    if (error) return res.status(500).json({ message: error.message });

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  const supabase = req.app.get('supabase');
  const userId = req.params.id;

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, address, role')
      .eq('id', userId)
      .single();

    if (error || !user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'store_owner') {
      const { data: storeRatings, error: errRat } = await supabase
        .from('ratings')
        .select('rating')
        .eq('store_owner_id', user.id);

      if (!errRat && storeRatings && storeRatings.length > 0) {
        const avgRating =
          storeRatings.reduce((sum, r) => sum + r.rating, 0) / storeRatings.length;
        user.averageRating = avgRating.toFixed(2);
      } else {
        user.averageRating = null;
      }
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addUser = async (req, res) => {
  const supabase = req.app.get('supabase');
  const { name, email, password, address, role } = req.body;

  if (!nameValid(name)) return res.status(400).json({ message: 'Name must be 20-60 chars' });
  if (!addressValid(address)) return res.status(400).json({ message: 'Address max 400 chars' });
  if (!passwordValid(password)) return res.status(400).json({ message: 'Password invalid format' });
  if (!emailValid(email)) return res.status(400).json({ message: 'Invalid email' });
  if (!role || !['system_admin', 'normal_user', 'store_owner'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase.from('users').insert({
      name,
      email,
      address,
      password: hashedPassword,
      role,
    });

    if (error) throw error;

    return res.status(201).json({ message: 'User added successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  const supabase = req.app.get('supabase');
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  if (!passwordValid(newPassword)) return res.status(400).json({ message: 'Password invalid format' });

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('password')
      .eq('id', userId)
      .single();

    if (error || !user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ message: 'Old password incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('id', userId);

    if (updateError) throw updateError;

    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, getUserById, addUser, updatePassword };