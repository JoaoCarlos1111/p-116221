
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    token: 'token123',
    user: {
      id: '1',
      name: 'Usuario',
      email: req.body.email,
      role: 'admin',
      department: 'atendimento',
      isAdmin: true
    }
  });
});

app.listen(PORT, () => {
  console.log(`Backend funcionando na porta ${PORT}`);
});
