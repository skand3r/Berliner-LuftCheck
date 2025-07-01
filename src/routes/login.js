// routes/login.js
import { Router } from 'express';
import { findOneUser } from '../db/usersCRUDs.js';

const loginRouter = Router();

loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body;
    const user = await findOneUser(username, password);

    if (user) {
        res.status(200).json(user); // ✅ success
    } else {
        res.status(401).send('Unauthorized'); // ❌ bad credentials
    }
});

export default loginRouter;
