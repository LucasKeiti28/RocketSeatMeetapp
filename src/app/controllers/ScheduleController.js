import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import User from '../models/User';
import Appointment from '../models/Appointment';

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res
        .status(401)
        .json({ error: 'Usuario nao e um prestador de servico' });
    }

    const { date } = req.query;
    // const parsedDate = parseISO(date);
    const dateConfirmed = date;

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        // date: {
        //   [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        // },
        date: dateConfirmed,
      },

      order: ['date'],
    });
    return res.json(appointments);
  }
}

export default new ScheduleController();
