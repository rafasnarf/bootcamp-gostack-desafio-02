/* eslint-disable class-methods-use-this */
import { Op } from 'sequelize';
import { subDays } from 'date-fns';
import Student from '../models/Student';
import Checkin from '../models/Checkin';

class CheckinController {
  async store(req, res) {
    const studentExists = await Student.findOne(
      { where: { id: req.params.id, hasplan: true } },
      {
        include: [
          {
            model: Student,
            as: 'student_id',
            attributes: ['id', 'name', 'hasplan'],
          },
        ],
      }
    );
    if (!studentExists) {
      return res
        .status(400)
        .json({ error: 'Aluno não cadastrado ou com plano vencido' });
    }
    const countCheckin = await Checkin.findAndCountAll({
      where: {
        student_id: req.params.id,
        created_at: { [Op.gte]: subDays(new Date(), 7) },
      },
    });

    if (countCheckin.count >= 5) {
      return res
        .status(400)
        .json({ error: 'Máximo de acesso permitido na semana' });
    }
    await Checkin.create({
      student_id: req.params.id,
    });
    return res.json({ message: 'Entrada Liberada' });
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const checkins = await Checkin.findAll(
      { where: { student_id: req.params.id } },
      {
        attributes: ['id', 'student_id', 'created_at'],
        limit: 20,
        offset: (page - 1) * 20,
      }
    );
    return res.json(checkins);
  }
}
export default new CheckinController();
