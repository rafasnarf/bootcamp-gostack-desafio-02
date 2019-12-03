import * as Yup from 'yup';
import Student from '../models/Student';
import HelpOrders from '../models/HelpOrders';

class HelpOrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      question: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Faltam dados a serem preenchidos' });
    }
    const studentExists = await Student.findOne(
      { where: { id: req.params.id } },
      {
        include: [
          {
            model: Student,
            as: 'student_id',
            attributes: ['name', 'email'],
          },
        ],
      }
    );
    if (!studentExists) {
      return res.status(400).json({ error: 'Aluno não cadastrado' });
    }
    const { student_id, question } = req.body;
    const HelpOrder = await HelpOrders.create({
      student_id,
      question,
    });
    return res.json(HelpOrder);
  }
}

export default new HelpOrderController();
