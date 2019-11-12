/* eslint-disable class-methods-use-this */
import Student from '../models/Student';
import Checkin from '../models/Checkin';

class CheckinController {
  async store(req, res) {
    const studentExists = await Student.findAndCountAll(
      { where: { id: req.params.id } },
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
      return res.status(400).json({ error: 'Aluno não cadastrado' });
    }
    const countCheckin = await Checkin.findAndCountAll({
      where: { student_id: req.params.id },
    });
    if (countCheckin.count < 5) {
      const CheckIn = await Checkin.create({
        student_id: req.params.id,
      });
    }
    return res
      .status(400)
      .json({ error: 'Máximo de acesso permitido na semana' });
  }
}
export default new CheckinController();
