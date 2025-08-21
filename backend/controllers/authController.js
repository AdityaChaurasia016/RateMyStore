const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { nameValid, addressValid, passwordValid, emailValid } = require('../utils/validation');

const signup = async (req, res) => {
  const supabase = req.app.get('supabase');
  const { name, email, address, password } = req.body;

  if (!nameValid(name)) return res.status(400).json({ message: 'Name must be 20-60 chars' });
  if (!addressValid(address)) return res.status(400).json({ message: 'Address max 400 chars' });
  if (!passwordValid(password)) return res.status(400).json({ message: 'Password invalid format' });
  if (!emailValid(email)) return res.status(400).json({ message: 'Invalid email' });

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
      role: 'normal_user',
    });

    if (error) throw error;

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const login = async (req, res) => {
  const supabase = req.app.get('supabase');
  const { email, password } = req.body;

  if (!emailValid(email)) return res.status(400).json({ message: 'Invalid email' });

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address } });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { signup, login };