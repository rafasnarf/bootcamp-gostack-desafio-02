/* eslint-disable class-methods-use-this */
import HelpOrders from '../models/HelpOrders';
import Student from '../models/Student';

class StudentAnswerController {
  async index(req, res) {
    const studentExists = await Student.findOne({
      where: { id: req.params.id },
    });
    if (!studentExists) {
      return res.status(400).json({ error: 'Aluno não existe' });
    }
    const { page = 1 } = req.query;
    const orders = await HelpOrders.findAll({
      where: { student_id: req.params.id },
      order: ['created_at'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    if (!orders) {
      return res
        .status(400)
        .json({ message: 'Nenhuma Solicitação encontrada' });
    }
    return res.json(orders);
  }
}
export default new StudentAnswerController();
