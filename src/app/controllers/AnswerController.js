/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';
import { parseISO } from 'date-fns';

import HelpOrders from '../models/HelpOrders';
import Student from '../models/Student';
import Queue from '../../lib/Queue';

class AnswerController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const orders = await HelpOrders.findAll({
      where: { answer_at: null, answer: null },
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
    return res.json(orders);
  }

  async store(req, res) {
    const answerExists = await HelpOrders.findOne({
      where: { id: req.params.id },
    });
    if (!answerExists) {
      return res
        .status(400)
        .json({ error: 'Solicitação de auxílio não encontrada' });
    }
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
      answer_at: Yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Faltam dados a serem preenchidos' });
    }

    const { answer, answer_at } = req.body;
    const validAnswer = await HelpOrders.update(
      { answer, answer_at },
      { where: { id: req.params.id } }
    );
    return res.json(validAnswer);
  }
}
export default new AnswerController();
